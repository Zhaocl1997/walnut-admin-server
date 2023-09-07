import { Injectable, Logger } from '@nestjs/common';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  private readonly logger = new Logger('ConfigService - Cache');

  constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions<RedisClientOptions> {
    this.logger.debug(`Connecting to redis server...`);

    return {
      isGlobal: true,
      store: async () => {
        return await redisStore({
          socket: {
            host: this.configService.get('app.redis.host'),
            port: this.configService.get('app.redis.port'),
          },
          password: this.configService.get('app.redis.pass'),
          ttl: this.configService.get<number>('app.cache.ttl'),
        });
      },
    };
  }
}
