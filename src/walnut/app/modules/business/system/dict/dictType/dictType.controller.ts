import { Controller, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SysDictTypeService } from './dictType.service';
import { SysDictTypeDto } from './dto/dictType.dto';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { WalnutCrudDecorators } from '@/decorators/crud';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstPermissionDictType } from '@/const/permissions/dictType';
import { WalnutIdParamDecorator } from '@/decorators/param/objectId';

const {
  CreateDecorator,
  ReadDecorator,
  UpdateDecorator,
  DeleteDecorator,
  ListDecorator,
} = WalnutCrudDecorators({
  title: AppConstLogOperateTitle.DICT_TYPE,
  DTO: SysDictTypeDto,
});

@ApiTags('system/dict/type')
@Controller('system/dict/type')
@UseGuards(JwtAccessGuard)
export class SysDictTypeController {
  constructor(private dictTypeService: SysDictTypeService) {}

  @CreateDecorator()
  @HasPermission(AppConstPermissionDictType.CREATE)
  async create(@Body() payload: SysDictTypeDto) {
    return await this.dictTypeService.create(payload);
  }

  @ReadDecorator()
  @HasPermission(AppConstPermissionDictType.READ)
  async read(@WalnutIdParamDecorator() id: string) {
    return await this.dictTypeService.read(id);
  }

  @UpdateDecorator()
  @HasPermission(AppConstPermissionDictType.UPDATE)
  async update(@Body() payload: SysDictTypeDto) {
    return await this.dictTypeService.update(payload);
  }

  @DeleteDecorator()
  @HasPermission(AppConstPermissionDictType.DELETE)
  async delete(@WalnutIdParamDecorator() id: string) {
    return await this.dictTypeService.delete(id);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionDictType.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<SysDictTypeDto>) {
    return await this.dictTypeService.findAll(params);
  }
}
