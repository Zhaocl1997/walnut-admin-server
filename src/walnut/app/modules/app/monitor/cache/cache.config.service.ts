import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import  * as redisStore from 'cache-manager-redis-store';
import type { RedisClientOptions } from 'redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  private readonly logger = new Logger('ConfigService - Cache');

  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions<RedisClientOptions> {
    const redisHost = this.configService.get('app.redis.host');
    const redisPort = this.configService.get('app.redis.port');
    const redisPass = this.configService.get('app.redis.pass');

    const redisUrl = `redis://default:${redisPass}@${redisHost}:${redisPort}`;

    this.logger.debug(`Connecting to redis server...`);

    return {
      isGlobal: true,
      ttl: this.configService.get<number>('app.cache.ttl'),
      max: this.configService.get<number>('app.cache.max'),

      store: redisStore,
      url: redisUrl,
    };
  }
}
