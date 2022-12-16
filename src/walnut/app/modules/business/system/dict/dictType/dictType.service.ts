import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';

import {
  SysDictTypeModel,
  SysDictTypeDocument,
} from './schema/dictType.schema';
import { SysDictTypeRepository } from './dictType.repository';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { SysDictTypeDto } from './dto/dictType.dto';
import { AppConstCollectionName } from '@/const/db/collectionName';

@Injectable()
export class SysDictTypeService {
  constructor(
    @AppInjectModel(SysDictTypeModel.name)
    private SysDictTypeModel: Model<SysDictTypeDocument>,
    private SysDictTypeRepo: SysDictTypeRepository,
  ) {}

  // base CRUD
  async create(dto: SysDictTypeDto) {
    return await this.SysDictTypeRepo.create(dto);
  }

  async read(id: string) {
    return await this.SysDictTypeRepo.readById(id);
  }

  async update(dto: SysDictTypeDto) {
    return await this.SysDictTypeRepo.update(dto);
  }

  async delete(id: string) {
    return await this.SysDictTypeRepo.delete(id);
  }

  async findAll(params?: WalnutListRequestDTO<SysDictTypeDto>) {
    return await this.SysDictTypeRepo.list(params, [
      {
        $lookup: {
          from: AppConstCollectionName.DICT_DATA,
          localField: '_id',
          foreignField: 'typeId',
          pipeline: [{ $match: { deleted: false } }],
          as: 'count',
        },
      },
      { $addFields: { dictDataCount: { $size: '$count' } } },
      { $unset: 'count' },
    ]);
  }

  /**
   * @description: get dict by type
   */
  async getByType(type: string) {
    const data = await this.SysDictTypeModel.findOne({ type })
      .select('name type description')
      .populate({
        path: 'dictData',
        select: 'value label order description tagType -_id -typeId',
      })
      .lean();

    if (!data) return null;

    return data;
  }
}
