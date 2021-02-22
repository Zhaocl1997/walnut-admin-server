import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Log } from './schema/log.schema';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private logModel: Model<Log>) {}

  async create(dto): Promise<Log> {
    return await this.logModel.create(dto);
  }

  async findAll(): Promise<Log[]> {
    return await this.logModel.find({ deleted: false });
  }
}
