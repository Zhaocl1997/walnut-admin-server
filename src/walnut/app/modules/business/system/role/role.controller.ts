import { Controller, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SysRoleService } from './role.service';
import { SysRoleDto } from './dto/role.dto';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { WalnutCrudDecorators } from '@/decorators/crud';
import {
  WalnutIdParamDecorator,
  WalnutIdsParamDecorator,
} from '@/decorators/param/objectId';
import { AppConstPermissionRole } from '@/const/permissions/role';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';

const {
  CreateDecorator,
  ReadDecorator,
  UpdateDecorator,
  DeleteDecorator,
  DeleteManyDecorator,
  ListDecorator,
} = WalnutCrudDecorators({
  title: AppConstLogOperateTitle.ROLE,
  DTO: SysRoleDto,
});

@ApiTags('system/role')
@Controller('system/role')
@UseGuards(JwtAccessGuard)
export class SysRoleController {
  constructor(private roleService: SysRoleService) {}

  @CreateDecorator()
  @HasPermission(AppConstPermissionRole.CREATE)
  async create(@Body() payload: SysRoleDto) {
    return await this.roleService.create(payload);
  }

  @ReadDecorator()
  @HasPermission(AppConstPermissionRole.READ)
  async read(@WalnutIdParamDecorator() id: string) {
    return await this.roleService.read(id);
  }

  @UpdateDecorator()
  @HasPermission(AppConstPermissionRole.UPDATE)
  async update(@Body() payload: SysRoleDto) {
    return await this.roleService.update(payload);
  }

  @DeleteDecorator()
  @HasPermission(AppConstPermissionRole.DELETE)
  async delete(@WalnutIdParamDecorator() id: string) {
    return await this.roleService.delete(id);
  }

  @DeleteManyDecorator()
  @HasPermission(AppConstPermissionRole.DELETE_MANY)
  async deleteMany(@WalnutIdsParamDecorator() ids: string) {
    return await this.roleService.deleteMany(ids);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionRole.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<SysRoleDto>) {
    return await this.roleService.findAll(params);
  }
}
