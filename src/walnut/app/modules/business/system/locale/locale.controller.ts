import {
  Controller,
  Get,
  Param,
  Body,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SysLocaleService } from './locale.service';
import { SysLocaleDto } from './dto/locale.dto';
import { SysLocaleMessageDTO } from './dto/message.dto';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { WalnutCrudDecorators } from '@/decorators/crud';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstPermissionLocale } from '@/const/permissions/locale';
import { Public } from '@/decorators/app/public';

const {
  CreateDecorator,
  ReadDecorator,
  UpdateDecorator,
  DeleteDecorator,
  DeleteManyDecorator,
  ListDecorator,
} = WalnutCrudDecorators({
  title: AppConstLogOperateTitle.LOCALE,
  DTO: SysLocaleDto,
});

@ApiTags('system/locale')
@Controller('system/locale')
@UseGuards(JwtAccessGuard)
export class SysLocaleController {
  constructor(private localeService: SysLocaleService) {}

  @Public()
  @Get('/message/:locale')
  @HttpCode(HttpStatus.OK)
  async getLocaleMessage(
    @Param('locale') locale: string,
    @Query('cache', new DefaultValuePipe(1), ParseIntPipe) cache: number,
  ) {
    return await this.localeService.getLocaleMessage(locale, cache === 1);
  }

  @CreateDecorator()
  @HasPermission(AppConstPermissionLocale.CREATE)
  async create(@Body() payload: SysLocaleDto) {
    return await this.localeService.create(payload);
  }

  @ReadDecorator('key')
  @HasPermission(AppConstPermissionLocale.READ)
  async read(@Param('key') key: string) {
    return await this.localeService.read(key);
  }

  @UpdateDecorator()
  @HasPermission(AppConstPermissionLocale.UPDATE)
  async update(@Body() payload: SysLocaleDto) {
    return await this.localeService.update(payload);
  }

  @DeleteDecorator('key')
  @HasPermission(AppConstPermissionLocale.DELETE)
  async delete(@Param('key') key: string) {
    return await this.localeService.deleteByKey(key);
  }

  @DeleteManyDecorator('keys')
  @HasPermission(AppConstPermissionLocale.DELETE_MANY)
  async deleteMany(@Param('keys') keys: string) {
    return await this.localeService.deleteMany(keys);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionLocale.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<SysLocaleDto>) {
    return await this.localeService.findAll(params);
  }
}
