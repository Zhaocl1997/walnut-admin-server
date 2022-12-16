import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { Model } from 'mongoose';

import {
  SysDictDataModel,
  SysDictDataDocument,
} from './schema/dictData.schema';
import { SysDictDataRepository } from './dictData.repository';
import { SysDictTypeService } from '../dictType/dictType.service';
import { SysLocaleService } from '../../locale/locale.service';
import { SysDictDataDto } from './dto/dictData.dto';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';

@Injectable()
export class SysDictDataService {
  constructor(
    @AppInjectModel(SysDictDataModel.name)
    private SysDictDataModel: Model<SysDictDataDocument>,
    private SysDictDataRepo: SysDictDataRepository,
    private SysDictTypeService: SysDictTypeService,
    private SysLocaleService: SysLocaleService,
  ) {}

  // base CRUD
  async create(dto: SysDictDataDto) {
    return await this.SysDictDataRepo.create(dto);
  }

  async read(id: string) {
    return await this.SysDictDataRepo.readById(id);
  }

  async update(dto: SysDictDataDto) {
    return await this.SysDictDataRepo.update(dto);
  }

  async delete(id: string) {
    const deletedDictData = await this.SysDictDataRepo.delete(id);

    // delete all locales with deleted dict data label
    await this.SysLocaleService.deleteByKey(deletedDictData.label);

    return deletedDictData;
  }

  async findAll(params?: WalnutListRequestDTO<SysDictDataDto>) {
    return await this.SysDictDataRepo.list(params);
  }

  /**
   * @description: get dict data by type
   */
  async getDictDataByType(type: string) {
    return await this.SysDictTypeService.getByType(type);
  }
}
