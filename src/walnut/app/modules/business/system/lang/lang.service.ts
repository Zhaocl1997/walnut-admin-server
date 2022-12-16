import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { SysLangModel, SysLangDocument } from './schema/lang.schema';
import { SysLangRepository } from './lang.repository';
import { SysLocaleService } from '../locale/locale.service';
import { SysLangDto } from './dto/lang.dto';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppConstCollectionName } from '@/const/db/collectionName';
import { AppInjectModel } from '@/database/database.decorator';

@Injectable()
export class SysLangService {
  constructor(
    @AppInjectModel(SysLangModel.name)
    private readonly SysLangModel: Model<SysLangDocument>,
    private readonly SysLangRepo: SysLangRepository,
    @Inject(forwardRef(() => SysLocaleService))
    private readonly SysLocaleService: SysLocaleService,
  ) {}

  // base CRUD
  async create(dto: SysLangDto) {
    return await this.SysLangRepo.create(dto);
  }

  async read(id: string) {
    return await this.SysLangRepo.readById(id);
  }

  async update(dto: SysLangDto) {
    return await this.SysLangRepo.update(dto);
  }

  async delete(id: string) {
    const deletedLang = await this.SysLangRepo.delete(id);

    // delete all locales with deleted language id
    await this.SysLocaleService.deleteByLangId(deletedLang._id);

    return deletedLang;
  }

  async findAll(params?: WalnutListRequestDTO<SysLangDto>) {
    return await this.SysLangRepo.list(params);
  }

  /**
   * @description: public language list, no auth
   */
  async listPublic() {
    return await this.SysLangModel.find(
      { deleted: false, status: true },
      { order: 1, lang: 1, description: 1, _id: 0 },
    ).lean();
  }

  /**
   * @description: get locale messages by language
   */
  async getByLangName(lang: string) {
    const res = await this.SysLangModel.aggregate([
      {
        $match: { lang, deleted: false },
      },
      {
        $lookup: {
          from: AppConstCollectionName.LOCALE,
          let: { id: '$_id' },
          pipeline: [
            { $match: { deleted: false } },
            {
              $match: {
                $expr: {
                  $eq: ['$langId', { $toObjectId: '$$id' }],
                },
              },
            },
          ],
          as: 'msg',
        },
      },
      {
        $project: {
          data: {
            $arrayToObject: {
              $map: {
                input: '$msg',
                as: 'm',
                in: {
                  k: '$$m.key',
                  v: '$$m.value',
                },
              },
            },
          },
        },
      },
    ]);

    return res[0];
  }
}
