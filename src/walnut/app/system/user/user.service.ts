import { Model, Error } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserInterface } from './user.interface';
import { User, UserDocument } from './user.schema';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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

  async create(dto: CreateUserDto): Promise<User> {
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

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
