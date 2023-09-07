import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService } from './cache.config.service';
import { AppCacheController } from './cache.controller';
import { AppCacheAppSettingsService } from './services/cache.appSettings';
import { AppCacheService } from './cache.service';
import { AppCachePermissionsService } from './services/cache.permissions';
import { AppCacheRolesService } from './services/cache.roles';

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
  providers: [
    AppCacheService,
    AppCacheAppSettingsService,
    AppCachePermissionsService,
    AppCacheRolesService,
  ],
  exports: [
    AppCacheService,
    AppCacheAppSettingsService,
    AppCachePermissionsService,
    AppCacheRolesService,
  ],
})
export class AppCacheModule {}
