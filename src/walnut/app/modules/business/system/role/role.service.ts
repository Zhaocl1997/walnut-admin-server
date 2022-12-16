import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';

import { SysRoleModel, SysRoleDocument } from './schema/role.schema';
import { SysRoleRepository } from './role.repository';
import { SysRoleDto } from './dto/role.dto';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { WalnutExceptionDataNotFound } from '@/exceptions/bussiness/data';
import { SysRoleEntity } from './entities/role.entity';
import { WalnutExceptionCustom } from '@/exceptions/base.exception';
import { AppConstCollectionName } from '@/const/db/collectionName';

@Injectable()
export class SysRoleService {
  constructor(
    @AppInjectModel(SysRoleModel.name)
    private SysRoleModel: Model<SysRoleDocument>,
    private SysRoleRepo: SysRoleRepository,
  ) {}

  async findOne(roleName: string): Promise<SysRoleModel> {
    return this.SysRoleModel.findOne({ roleName: roleName });
  }

  async findById(id: string): Promise<SysRoleModel> {
    return this.SysRoleModel.findById(id);
  }

  // base CRUD
  async create(dto: SysRoleDto) {
    return await this.SysRoleRepo.create(dto);
  }

  async read(id: string) {
    return await this.SysRoleRepo.readById(id);
  }

  async update(dto: SysRoleDto) {
    return await this.SysRoleRepo.update(dto);
  }

  async delete(id: string) {
    const deleted = await this.SysRoleModel.aggregate([
      { $match: { _id: new Types.ObjectId(id), deleted: false } },
      {
        $lookup: {
          from: AppConstCollectionName.USER,
          localField: '_id',
          foreignField: 'role',
          pipeline: [{ $match: { deleted: false } }],
          as: 'count',
        },
      },
      { $addFields: { usersCount: { $size: '$count' } } },
      { $unset: 'count' },
    ]);

    if (!deleted[0]) {
      throw new WalnutExceptionDataNotFound();
    }

    if (deleted[0].usersCount !== 0) {
      // TODO
      throw new WalnutExceptionCustom('This role has bound users, please make sure there are not.');
    }

    const updateDeleted = await this.SysRoleModel.findByIdAndUpdate(
      id,
      {
        deleted: true,
      },
      { new: true },
    );

    return new SysRoleEntity(updateDeleted);
  }

  async deleteMany(ids: string) {
    return await this.SysRoleRepo.deleteMany(ids);
  }

  async findAll(params: WalnutListRequestDTO<SysRoleDto>) {
    return await this.SysRoleRepo.list(params, [
      {
        $lookup: {
          from: AppConstCollectionName.USER,
          localField: '_id',
          foreignField: 'role',
          pipeline: [{ $match: { deleted: false } }],
          as: 'count',
        },
      },
      { $addFields: { usersCount: { $size: '$count' } } },
      { $unset: 'count' },
    ]);
  }
}
