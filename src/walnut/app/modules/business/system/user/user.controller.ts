import { Controller, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SysUserService } from './user.service';
import { SysUserDto } from './dto/user.dto';
import { SysUserEntity } from './entities/user.entity';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { WalnutCrudDecorators } from '@/decorators/crud';
import {
  WalnutIdParamDecorator,
  WalnutIdsParamDecorator,
} from '@/decorators/param/objectId';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstPermissionUser } from '@/const/permissions/user';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';

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
    return await this.userService.createUser(payload)
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
}
