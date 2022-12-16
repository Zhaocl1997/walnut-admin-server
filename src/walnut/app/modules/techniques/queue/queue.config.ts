import { Injectable, Logger } from '@nestjs/common';
import {
  BullModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  private readonly logger = new Logger('ConfigService - Queue');

  constructor(private readonly configService: ConfigService) {}

  createSharedConfiguration(): BullModuleOptions {
    this.logger.debug('Initiating queue module...');

    return {
      redis: {
        host: this.configService.get('app.redis.host'),
        port: this.configService.get('app.redis.port'),
        password: this.configService.get('app.redis.pass'),
      },
    };
  }
}
