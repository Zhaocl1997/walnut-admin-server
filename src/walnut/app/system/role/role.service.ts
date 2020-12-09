import { Model, Error } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Role, RoleDocument } from './schema/role.schema';

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async findOne(roleName: string): Promise<Role> {
    return this.roleModel.findOne({ rolename: roleName });
  }

  async findById(id: string): Promise<Role> {
    return this.roleModel.findById(id);
  }

  async read(dto: any): Promise<Role> {
    return await this.roleModel.findById(dto.id);
  }

  async delete(id: string): Promise<Role> {
    const deletedRole = await this.roleModel.findById({ _id: id });
    if (!deletedRole) {
      throw new Error("Role doesn't exist.");
    } else {
      await deletedRole.remove();
      return deletedRole;
    }
  }

  async create(dto: Role): Promise<Role> {
    const createdRole = await this.roleModel.create(dto);
    return await createdRole.save();
  }

  async update(dto: any) {
    const oldRole = await this.roleModel.findById(dto.id);

    if (!oldRole) {
      throw new Error('role not found');
    }

    return await oldRole.updateOne(dto);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleModel
      .find()
      .populate('usersCount')
      .populate('users')
      .lean();
  }
}
