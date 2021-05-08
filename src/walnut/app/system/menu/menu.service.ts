import { Model, Error, Schema } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Menu } from './schema/menu.schema';
import { ResponseSuccess } from '../../shared/response';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Menu.name) private menuModel: Model<Menu>) {}

  async findById(id: Schema.Types.ObjectId) {
    return ResponseSuccess(await this.menuModel.findById(id));
  }

  async create(dto: Menu) {
    return ResponseSuccess(await this.menuModel.create(dto));
  }

  async read(id: Schema.Types.ObjectId) {
    return ResponseSuccess(await this.menuModel.findOne({ _id: id, deleted: false }));
  }

  async update(dto: Menu) {
    const oldMenu = await this.menuModel.findOneAndUpdate(
      {
        _id: dto._id,
        deleted: false,
      },
      dto,
      { new: true },
    );

    if (!oldMenu) {
      throw new Error('Menu does not found');
    }

    return ResponseSuccess(oldMenu);
  }

  async delete(id: Schema.Types.ObjectId) {
    const deletedMenu = await this.menuModel.findOne({
      _id: id,
      deleted: false,
    });

    if (!deletedMenu) {
      throw new Error('Menu does not found');
    }

    deletedMenu.deleted = true;

    await deletedMenu.save();

    return ResponseSuccess(deletedMenu);
  }

  async findAll(): Promise<any> {
    const data = await this.menuModel.find({ deleted: false });

    const total = await this.menuModel
      .find({ deleted: false })
      .countDocuments();

    return ResponseSuccess({
      data,
      total,
    });
  }

  async getIcons(): Promise<any> {
    const icon = await this.menuModel.find({ deleted: false });
    const ret = [...new Set(icon.map((item) => item.icon).filter((i) => i))];

    return ResponseSuccess({
      data: ret,
      total: ret.length,
    }) 
  }
}
