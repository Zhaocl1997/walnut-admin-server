import { Injectable, Logger } from '@nestjs/common';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  private readonly logger = new Logger('ConfigService - Mongoose');

  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const uri = `mongodb://${this.configService.get<string>(
      'database.host',
    )}:${this.configService.get<string>('database.port')}`;

    this.logger.debug('Initiating database module...');

    return {
      uri,

      dbName: this.configService.get<string>('database.name'),

      authSource: this.configService.get<string>('database.source'),

      auth: {
        username: this.configService.get<string>('database.user'),
        password: this.configService.get<string>('database.pass'),
      },

      autoIndex: true,

      connectionFactory: (connection) => {
        if (connection.readyState === 1) {
          this.logger.debug('DB connected');
        }

        connection.on('disconnected', () => {
          this.logger.error('DB disconnected');
        });

        return connection;
      },
    };
  }
}
