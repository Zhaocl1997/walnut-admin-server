import {
  Controller,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SysLangService } from './lang.service';
import { SysLangDto } from './dto/lang.dto';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { WalnutCrudDecorators } from '@/decorators/crud';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstPermissionLang } from '@/const/permissions/langs';
import { WalnutIdParamDecorator } from '@/decorators/param/objectId';
import { Public } from '@/decorators/app/public';

const {
  CreateDecorator,
  ReadDecorator,
  UpdateDecorator,
  DeleteDecorator,
  ListDecorator,
} = WalnutCrudDecorators({
  title: AppConstLogOperateTitle.LANG,
  DTO: SysLangDto,
});

@ApiTags('system/lang')
@Controller('system/lang')
@UseGuards(JwtAccessGuard)
export class SysLangController {
  constructor(private langService: SysLangService) {}

  @CreateDecorator()
  @HasPermission(AppConstPermissionLang.CREATE)
  async create(@Body() payload: SysLangDto) {
    return await this.langService.create(payload);
  }

  @ReadDecorator()
  @HasPermission(AppConstPermissionLang.READ)
  async read(@WalnutIdParamDecorator() id: string) {
    return await this.langService.read(id);
  }

  @UpdateDecorator()
  @HasPermission(AppConstPermissionLang.UPDATE)
  async update(@Body() payload: SysLangDto) {
    return await this.langService.update(payload);
  }

  @DeleteDecorator()
  @HasPermission(AppConstPermissionLang.DELETE)
  async delete(@WalnutIdParamDecorator() id: string) {
    return await this.langService.delete(id);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionLang.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<SysLangDto>) {
    return await this.langService.findAll(params);
  }

  @Public()
  @Get('list/public')
  @HttpCode(HttpStatus.OK)
  async listPublic() {
    return await this.langService.listPublic();
  }
}
