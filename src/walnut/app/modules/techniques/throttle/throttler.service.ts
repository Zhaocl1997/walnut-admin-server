import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ThrottlerModuleOptions,
  ThrottlerOptionsFactory,
} from '@nestjs/throttler';

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  private readonly logger = new Logger('ConfigService - Throttler');

  constructor(private readonly configService: ConfigService) {}

  createThrottlerOptions(): ThrottlerModuleOptions {
    this.logger.debug('Initiating throttler module...');

    return [
      {
        ttl: this.configService.get<number>('app.throttle.ttl'),
        limit: this.configService.get<number>('app.throttle.limit'),
      },
    ];
  }
}
