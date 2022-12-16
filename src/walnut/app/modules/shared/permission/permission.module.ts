import { Global, Module } from '@nestjs/common';

import { SysMenuModule } from '../../business/system/menu/menu.module';
import { AppPermissionService } from './permission.service';

@Global()
@Module({
  imports: [SysMenuModule],
  controllers: [],
  providers: [AppPermissionService],
  exports: [AppPermissionService],
})
export class AppPermissionModule {}
