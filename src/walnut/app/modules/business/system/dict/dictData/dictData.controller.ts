import { Controller, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { omit } from 'lodash';

import { SysDictDataService } from './dictData.service';
import { SysDictDataDto } from './dto/dictData.dto';
import { SysDictDataEntity } from './entities/dictData.entity';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { WalnutCrudDecorators } from '@/decorators/crud';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstPermissionDictData } from '@/const/permissions/dictData';
import { WalnutIdParamDecorator } from '@/decorators/param/objectId';

const {
  CreateDecorator,
  ReadDecorator,
  UpdateDecorator,
  DeleteDecorator,
  ListDecorator,
} = WalnutCrudDecorators({
  title: AppConstLogOperateTitle.DICT_DATA,
  DTO: SysDictDataDto,
});

@ApiTags('system/dict/data')
@Controller('system/dict/data')
@UseGuards(JwtAccessGuard)
export class SysDictDataController {
  constructor(private dictDataService: SysDictDataService) {}

  @CreateDecorator()
  @HasPermission(AppConstPermissionDictData.CREATE)
  async create(@Body() payload: SysDictDataDto) {
    return await this.dictDataService.create(payload);
  }

  @ReadDecorator()
  @HasPermission(AppConstPermissionDictData.READ)
  async read(@WalnutIdParamDecorator() id: string) {
    return await this.dictDataService.read(id);
  }

  @UpdateDecorator()
  @HasPermission(AppConstPermissionDictData.UPDATE)
  async update(@Body() payload: SysDictDataDto) {
    return await this.dictDataService.update(payload);
  }

  @DeleteDecorator()
  @HasPermission(AppConstPermissionDictData.DELETE)
  async delete(@WalnutIdParamDecorator() id: string) {
    return await this.dictDataService.delete(id);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionDictData.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<SysDictDataDto>) {
    return await this.dictDataService.findAll(params);
  }

  @Get('/s/:type')
  async getDictByType(@Param('type') type: string) {
    const res = await this.dictDataService.getDictDataByType(type);

    return {
      ...omit(res, '_id'),
      // @ts-ignore
      dictData: res.dictData.map((i) => new SysDictDataEntity(i)),
    };
  }
}
