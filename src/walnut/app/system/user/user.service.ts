import { Model, Error } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dto';

import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private roleService: RoleService,
  ) {}

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username: username });
  }

  async read(dto: ReadUserDto): Promise<User> {
    return await this.userModel.findById(dto.id);
  }

  async delete(id: string): Promise<User> {
    const deletedUser = await this.userModel.findById({ _id: id });
    if (!deletedUser) {
      throw new Error("User doesn't exist.");
    } else {
      await deletedUser.remove();
      return deletedUser;
    }
  }

  async create(dto: UserDocument): Promise<User> {
    const defaultRole = await this.roleService.findOne('user');

    const createdUser = await this.userModel.create({
      ...dto,
      role: defaultRole._id,
    });

    return createdUser;
  }

  async update(dto: UpdateUserDto) {
    const oldUser = await this.userModel.findById(dto.id);

    if (!oldUser) {
      throw new Error('user not found');
    }

    return await oldUser.updateOne(dto);
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().populate('role').lean();
  }
}
