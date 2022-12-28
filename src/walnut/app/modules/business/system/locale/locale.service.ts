import { Injectable, Logger } from '@nestjs/common';
import { Model, Schema, isValidObjectId } from 'mongoose';

import { AppInjectModel } from '@/database/database.decorator';
import {
  WalnutListRequestDTO,
  WalnutListResponseDTO,
} from '@/common/dto/list.dto';
import {
  WalnutGetAggregateParams,
  WalnutGetListParams,
} from '@/utils/listParams';
import {
  WalnutExceptionDataDeleteError,
  WalnutExceptionDataExisted,
} from '@/exceptions/bussiness/data';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';

import { SysLangService } from '../lang/lang.service';
import { SysLocaleRepository } from './locale.repository';
import { SysLocaleDto } from './dto/locale.dto';
import { SysLocaleEntity } from './entities/locale.entity';
import { SysLocaleModel, SysLocaleDocument } from './schema/locale.schema';
import { SysLangDto } from '../lang/dto/lang.dto';
import { AppConstCacheType } from '@/const/app/cache';

@Injectable()
export class SysLocaleService {
  private readonly logger = new Logger(SysLocaleService.name);

  constructor(
    @AppInjectModel(SysLocaleModel.name)
    private readonly SysLocaleModel: Model<SysLocaleDocument>,
    private readonly SysLocaleRepo: SysLocaleRepository,
    private readonly sysLangService: SysLangService,

    private readonly cacheService: AppCacheService,
  ) {}

  private getKeys(lang: string) {
    return `LOCALE_${lang.replace('-', '_').toLocaleUpperCase()}`;
  }

  /**
   * @description used for cache locale messages
   */
  async extractLocaleMessagesIntoCache(
    _langs?: WalnutListResponseDTO<SysLangDto>,
  ) {
    const langs = _langs ?? (await this.sysLangService.findAll());

    this.logger.debug('Extracting Locale Messages...');

    await Promise.all(
      langs.data.map(async (i) => {
        const data = await this.sysLangService.getByLangName(i.lang);

        await this.cacheService.set(this.getKeys(i.lang), data.data, {
          t: AppConstCacheType.LOCALES,
        });
      }),
    );
  }

  /**
   * @description: main entry for locales message retrueve, temporary all get back
   */
  async getLocaleMessage(lang: string, cache: boolean) {
    const cached = await this.cacheService.get(this.getKeys(lang));

    if (cache && cached) {
      return cached;
    }

    if (!cache || !cached) {
      const locales = await this.sysLangService.getByLangName(lang);

      await this.cacheService.set(this.getKeys(lang), locales.data, {
        t: AppConstCacheType.LOCALES,
      });

      return locales.data;
    }
  }

  /**
   * @description: create locale messages, based on lang number to create correspond locale data
   */
  async create(dto: SysLocaleDto) {
    const langs = await this.sysLangService.findAll();
   
    const keys = Object.keys(dto);

    const isExist = await this.SysLocaleModel.findOne({
      key: dto.key,
    });  

    if (isExist) {
      throw new WalnutExceptionDataExisted('key');
    }

    const localeIds = keys.filter((i) => isValidObjectId(i));

    if (localeIds.length !== 0) {
      // This case is for has init locale value
      const promises = langs.data.map((lang) =>
        this.SysLocaleModel.create({
          key: dto.key,
          langId: lang._id,
          value: dto[lang._id as unknown as string] ?? '',
        }),
      );

      await Promise.all(promises);
    } else {
      // This case is for only add key, but no init value carry with
      // Need to init value to empty string
      const langs = await this.sysLangService.findAll();

      const promises = langs.data.map((lang) => {
        return this.SysLocaleModel.create({
          key: dto.key,
          langId: lang._id,
          value: '',
        });
      });

      await Promise.all(promises);
    }

    // re-extract the locale messsages into cache
    await this.extractLocaleMessagesIntoCache(langs);

    return true;
  }

  /**
   * @description: locale read, change the return data structure
   */
  async read(key: string) {
    const data = await this.SysLocaleModel.find({ key });

    const result = Object.fromEntries(data.map((i) => [i.langId, i.value]));

    return {
      ...result,
      key,
    };
  }

  /**
   * @description: update, need to consider change key
   */
  async update(dto: SysLocaleDto & { oldKey?: string }) {
    const langs = await this.sysLangService.findAll();

    const keys = Object.keys(dto);

    await Promise.all(
      keys
        .filter((i) => i.length === 24)
        .map(async (id) => {
          await this.SysLocaleModel.findOneAndUpdate(
            {
              key: dto.oldKey,
              langId: id as unknown as Schema.Types.ObjectId,
            },
            {
              value: dto[id],
              key: dto.key,
            },
            { new: true },
          );
        }),
    );

    // re-extract the locale messsages into cache
    await this.extractLocaleMessagesIntoCache(langs);

    return true;
  }

  /**
   * @description: delete locales through key
   */
  async deleteByKey(key: string) {
    const langs = await this.sysLangService.findAll();

    const deleted = await this.SysLocaleModel.updateMany(
      { key },
      { deleted: true },
    );

    if (deleted.matchedCount === 0) return;

    if (!deleted.acknowledged || deleted.matchedCount !== langs.total) {
      throw new WalnutExceptionDataDeleteError();
    }

    // re-extract the locale messsages into cache
    await this.extractLocaleMessagesIntoCache(langs);

    return deleted;
  }

  /**
   * @description: almost same as single delete, but $in
   */
  async deleteMany(keys: string) {
    const langs = await this.sysLangService.findAll();

    const keyArr = keys.split(',');

    const deleted = await this.SysLocaleModel.updateMany(
      {
        key: { $in: keyArr },
      },
      { deleted: true },
    );

    // The `matchedCount` should be key arr length * langs total count due to the database design
    if (
      !deleted.acknowledged ||
      deleted.matchedCount !== keyArr.length * langs.total
    ) {
      throw new WalnutExceptionDataDeleteError();
    }

    // re-extract the locale messsages into cache
    await this.extractLocaleMessagesIntoCache(langs);

    return deleted;
  }

  /**
   * @description: Delete locales by lang id, used for lang deleted case
   */
  async deleteByLangId(langId: Schema.Types.ObjectId) {
    const locales = await this.SysLocaleModel.find({ langId });
    const promises = locales.map(async (i) => {
      i.deleted = true;
      await i.save();
    });
    await Promise.all(promises);
  }

  /**
   * @description: base list, need to calc process of translation
   */
  async findAll(params: WalnutListRequestDTO<SysLocaleDto>) {
    const langs = await this.sysLangService.findAll();

    const baseParams = WalnutGetListParams(params);

    const { dataParams, totalParams } = WalnutGetAggregateParams(baseParams);

    const result = await this.SysLocaleModel.aggregate<IWalnutResponseListData>(
      [
        {
          $group: {
            _id: '$key',
            data: { $push: '$$ROOT' },
          },
        },

        {
          $project: {
            _id: '$_id',
            key: '$_id',
            value: '$data.value',
            createdAt: { $arrayElemAt: ['$data.createdAt', 0] },
            updatedAt: { $arrayElemAt: ['$data.updatedAt', 0] },
            deleted: { $arrayElemAt: ['$data.deleted', 0] },
            process: {
              $let: {
                vars: {
                  unfinished: {
                    $size: {
                      $filter: {
                        input: '$data.value',
                        as: 'v',
                        cond: { $not: { $eq: ['', '$$v'] } },
                      },
                    },
                  },
                },
                in: {
                  $divide: ['$$unfinished', langs.data.length],
                },
              },
            },
          },
        },

        {
          $facet: {
            total: totalParams,
            data: dataParams,
          },
        },
        { $project: { total: { $arrayElemAt: ['$total.total', 0] }, data: 1 } },
      ],
    );

    return {
      total: result[0].total ?? 0,
      data: result[0].data.map((i) => new SysLocaleEntity(i)),
    };
  }
}
