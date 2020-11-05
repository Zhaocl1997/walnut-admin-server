import { Model, Error } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserInterface } from './user.interface';
import { User } from './user.schema';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async read(dto: ReadUserDto): Promise<UserInterface> {
    return await this.userModel.findById(dto.id);
  }
  async delete(id: string) {
    return await this.userModel.deleteOne({ _id: id });
  }

  async create(dto: CreateUserDto) {
    const createdUser = await this.userModel.create(dto);
    return createdUser.save();
  }

  async update(dto: UpdateUserDto) {
    const oldUser = await this.userModel.findById(dto.id);

    if (!oldUser) {
      throw new Error('user not found');
    }

    return await oldUser.updateOne(dto);
  }

  async findAll(): Promise<UserInterface[]> {
    return await this.userModel.find();
  }
}
