import { Injectable } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  getVariables(str) {
    return this.configService.get<string>(str);
  }

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: `${this.getVariables('db.host')}:${this.getVariables('db.port')}`,

      dbName: this.getVariables('db.name'),

      authSource: this.getVariables('db.source'),

      auth: {
        user: this.getVariables('db.user'),
        password: this.getVariables('db.pass'),
      },

      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      autoIndex: false,
    };
  }
}
