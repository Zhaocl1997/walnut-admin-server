import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

import { AuthModule } from '@/modules/auth/auth.module';

import { SysUserModule } from '@/modules/business/system/user/user.module';
import { SysRoleModule } from '@/modules/business/system/role/role.module';
import { SysMenuModule } from '@/modules/business/system/menu/menu.module';
import { SysLangModule } from '@/modules/business/system/lang/lang.module';
import { SysLocaleModule } from '@/modules/business/system/locale/locale.module';

import { SysDictTypeModule } from '@/modules/business/system/dict/dictType/dictType.module';
import { SysDictDataModule } from '@/modules/business/system/dict/dictData/dictData.module';

import { SharedAreaModule } from '@/modules/business/shared/area/area.module';
import { SharedAliModule } from '@/modules/business/shared/ali/ali.module';

import { SysLogAuthModule } from '@/modules/business/system/logs/auth/log.auth.module';
import { SysLogOperateModule } from '@/modules/business/system/logs/operate/log.module';
import { SysUserOauthModule } from '@/modules/business/system/user_oauth/user_oauth.module';

import { AppHealthModule } from '@/modules/techniques/health/health.module';
import { AppCacheModule } from '@/modules/app/monitor/cache/cache.module';
import { AppErrorModule } from '@/modules/techniques/error/error.module';

import { AppSettingsModule } from '@/modules/app/setting/setting.module';
import { AppMonitorServerModule } from '@/modules/app/monitor/server/server.module';
import { AppMonitorUserModule } from '@/modules/app/monitor/user/user.module';

@Module({
  imports: [
    AppHealthModule,
    AppCacheModule,
    AppErrorModule,

    AuthModule,

    SysUserModule,
    SysRoleModule,
    SysMenuModule,
    SysLangModule,
    SysLocaleModule,

    SysLogAuthModule,
    SysLogOperateModule,

    SysUserOauthModule,

    SysDictTypeModule,
    SysDictDataModule,

    SharedAreaModule,
    SharedAliModule,

    AppSettingsModule,
    AppMonitorServerModule,
    AppMonitorUserModule,
  ],
})
export class AppRouterModule {}
