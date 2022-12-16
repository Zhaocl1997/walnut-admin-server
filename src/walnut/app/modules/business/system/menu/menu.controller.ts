import { Controller, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SysMenuService } from './menu.service';
import { SysMenuDto } from './dto/menu.dto';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { WalnutCrudDecorators } from '@/decorators/crud';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { WalnutIdParamDecorator } from '@/decorators/param/objectId';
import { AppConstPermissionMenu } from '@/const/permissions/menu';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';

const {
  CreateDecorator,
  ReadDecorator,
  UpdateDecorator,
  DeleteDecorator,
  ListDecorator,
} = WalnutCrudDecorators({
  title: AppConstLogOperateTitle.MENU,
  DTO: SysMenuDto,
});

@ApiTags('system/menu')
@Controller('system/menu')
@UseGuards(JwtAccessGuard)
export class SysMenuController {
  constructor(private menuService: SysMenuService) {}

  @CreateDecorator()
  @HasPermission(AppConstPermissionMenu.CREATE)
  async create(@Body() payload: SysMenuDto) {
    return await this.menuService.create(payload);
  }

  @ReadDecorator()
  @HasPermission(AppConstPermissionMenu.READ)
  async read(@WalnutIdParamDecorator() id: string) {
    return await this.menuService.read(id);
  }

  @UpdateDecorator()
  @HasPermission(AppConstPermissionMenu.UPDATE)
  async update(@Body() payload: SysMenuDto) {
    return await this.menuService.update(payload);
  }

  @DeleteDecorator()
  @HasPermission(AppConstPermissionMenu.DELETE)
  async delete(@WalnutIdParamDecorator() id: string) {
    return await this.menuService.delete(id);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionMenu.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<SysMenuDto>) {
    return await this.menuService.findAll(params);
  }
}
