import { Controller, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SysLogOperateService } from './log.service';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { SysLogOperateDTO } from './dto/log.operate.dto';

import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { WalnutCrudDecorators } from '@/decorators/crud';
import {
  WalnutIdParamDecorator,
  WalnutIdsParamDecorator,
} from '@/decorators/param/objectId';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { AppConstPermissionLogOperate } from '@/const/permissions/logOperate';

const { ReadDecorator, DeleteDecorator, DeleteManyDecorator, ListDecorator } =
  WalnutCrudDecorators({
    title: AppConstLogOperateTitle.LOG_OPERATE,
    DTO: SysLogOperateDTO,
    extra: {
      needOperateLog: false,
    },
  });

@ApiTags('system/log/operate')
@Controller('system/log/operate')
@UseGuards(JwtAccessGuard)
export class SysLogOperateController {
  constructor(private logOperateService: SysLogOperateService) {}

  @ReadDecorator()
  @HasPermission(AppConstPermissionLogOperate.READ)
  async read(@WalnutIdParamDecorator() id: string) {
    return await this.logOperateService.read(id);
  }

  @DeleteDecorator()
  @HasPermission(AppConstPermissionLogOperate.DELETE)
  async delete(@WalnutIdParamDecorator() id: string) {
    return await this.logOperateService.delete(id);
  }

  @DeleteManyDecorator()
  @HasPermission(AppConstPermissionLogOperate.DELETE_MANY)
  async deleteMany(@WalnutIdsParamDecorator() id: string) {
    return await this.logOperateService.deleteMany(id);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionLogOperate.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<SysLogOperateDTO>) {
    return await this.logOperateService.findAll(params);
  }
}
