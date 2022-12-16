import { CacheModule, Global, Module } from '@nestjs/common';
import { CacheConfigService } from './cache.config.service';
import { AppCacheController } from './cache.controller';
import { AppCacheService } from './cache.service';

// TODO isGlobal option not working
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
      isGlobal: true,
    }),
  ],
  controllers: [AppCacheController],
  providers: [AppCacheService],
  exports: [AppCacheService],
})
export class AppCacheModule {}
