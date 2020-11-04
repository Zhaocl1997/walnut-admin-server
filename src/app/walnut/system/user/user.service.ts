import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserInterface } from './user.interface';
import { User } from './user.schema';
import { CreateUserDto, FindOneUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(dto: CreateUserDto) {
    const createdUser = await this.userModel.create(dto);
    return createdUser.save();
  }

  async findAll(): Promise<UserInterface[]> {
    return await this.userModel.find();
  }

  async findOne(dto: FindOneUserDto): Promise<UserInterface> {
    return await this.userModel.findById(dto._id);
  }
}
