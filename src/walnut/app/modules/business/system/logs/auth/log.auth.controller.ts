import { Controller, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SysLogAuthService } from './log.auth.service';

import { SysLogAuthDTO } from './dto/log.auth.dto';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { WalnutCrudDecorators } from '@/decorators/crud';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstPermissionLogAuth } from '@/const/permissions/logAuth';
import {
  WalnutIdParamDecorator,
  WalnutIdsParamDecorator,
} from '@/decorators/param/objectId';

const { DeleteDecorator, DeleteManyDecorator, ListDecorator } =
  WalnutCrudDecorators({
    title: AppConstLogOperateTitle.LOG_AUTH,
    DTO: SysLogAuthDTO,
    extra: {
      needOperateLog: false,
    },
  });

@ApiTags('system/log/auth')
@Controller('system/log/auth')
@UseGuards(JwtAccessGuard)
export class SysLogAuthController {
  constructor(private readonly logAuthService: SysLogAuthService) {}

  @DeleteDecorator()
  @HasPermission(AppConstPermissionLogAuth.DELETE)
  async delete(@WalnutIdParamDecorator() id: string) {
    return await this.logAuthService.delete(id);
  }

  @DeleteManyDecorator()
  @HasPermission(AppConstPermissionLogAuth.DELETE_MANY)
  async deleteMany(@WalnutIdsParamDecorator() id: string) {
    return await this.logAuthService.deleteMany(id);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionLogAuth.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<SysLogAuthDTO>) {
    return await this.logAuthService.findAll(params);
  }
}
