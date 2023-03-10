import {
  Controller,
  Body,
  UseGuards,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SysUserService } from './user.service';
import { SysUserDto } from './dto/user.dto';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import {
  AppConstLogOperateAction,
  AppConstLogOperateTitle,
} from '@/const/decorator/logOperate';
import { WalnutCrudDecorators } from '@/decorators/crud';
import {
  WalnutIdParamDecorator,
  WalnutIdsParamDecorator,
} from '@/decorators/param/objectId';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstPermissionUser } from '@/const/permissions/user';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { ApiWalnutOkResponse } from '@/decorators/swagger/response.decorator';
import { LogOperateDecorator } from '@/decorators/walnut/log.operate.decorator';
import { HasRole } from '@/decorators/walnut/hasRole.decorator';
import { AppConstRoles } from '@/const/role';
import { ResetPasswordDto, UpdatePasswordDto } from './dto/password.dto';

const {
  CreateDecorator,
  ReadDecorator,
  UpdateDecorator,
  DeleteDecorator,
  DeleteManyDecorator,
  ListDecorator,
} = WalnutCrudDecorators({
  title: AppConstLogOperateTitle.USER,
  DTO: SysUserDto,
});

@ApiTags('system/user')
@Controller('system/user')
@UseGuards(JwtAccessGuard)
export class SysUserController {
  constructor(private userService: SysUserService) {}

  @CreateDecorator()
  @HasPermission(AppConstPermissionUser.CREATE)
  async create(@Body() payload: SysUserDto) {
    return await this.userService.createUser(payload);
  }

  @ReadDecorator()
  @HasPermission(AppConstPermissionUser.READ)
  async read(@WalnutIdParamDecorator() id: string) {
    return await this.userService.read(id);
  }

  @UpdateDecorator()
  @HasPermission(AppConstPermissionUser.UPDATE)
  async update(@Body() payload: SysUserDto) {
    return await this.userService.update(payload);
  }

  @DeleteDecorator()
  @HasPermission(AppConstPermissionUser.DELETE)
  async delete(@WalnutIdParamDecorator() id: string) {
    return await this.userService.delete(id);
  }

  @DeleteManyDecorator()
  @HasPermission(AppConstPermissionUser.DELETE_MANY)
  async deleteMany(@WalnutIdsParamDecorator() ids: string) {
    return await this.userService.deleteMany(ids);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionUser.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<SysUserDto>) {
    return await this.userService.findAll(params);
  }

  @Patch('/password/update')
  @HttpCode(HttpStatus.OK)
  @ApiWalnutOkResponse({
    description: '更新密码',
    DTO: UpdatePasswordDto,
  })
  @LogOperateDecorator({
    title: AppConstLogOperateTitle.USER,
    action: AppConstLogOperateAction.UPDATE_PASSWORD,
  })
  @HasPermission(AppConstPermissionUser.PASSWORD_UPDATE)
  @HasRole(AppConstRoles.ADMIN)
  async updatePassword(@Body() payload: UpdatePasswordDto) {
    return await this.userService.updateUserPassword(
      payload.userId,
      payload.newPassword,
    );
  }

  @Patch('/password/reset')
  @HttpCode(HttpStatus.OK)
  @ApiWalnutOkResponse({
    description: '重置密码',
    DTO: ResetPasswordDto,
  })
  @LogOperateDecorator({
    title: AppConstLogOperateTitle.USER,
    action: AppConstLogOperateAction.RESET_PASSWORD,
  })
  @HasPermission(AppConstPermissionUser.PASSWORD_RESET)
  @HasRole(AppConstRoles.ADMIN)
  async resetPassword(@Body() payload: ResetPasswordDto) {
    return await this.userService.resetUserPasswordToDefault(payload.userId);
  }
}
