import { Controller, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppSettingService } from './setting.service';
import { AppSettingDto } from './dto/setting.dto';

import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppConstLogOperateTitle } from '@/const/decorator/logOperate';
import { WalnutCrudDecorators } from '@/decorators/crud';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { WalnutIdParamDecorator } from '@/decorators/param/objectId';
import { AppConstPermissionAppSetting } from '@/const/permissions/appSetting';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { WalnutUser } from '@/decorators/user.decorator';
import { Public } from '@/decorators/app/public';

const { CreateDecorator, ReadDecorator, UpdateDecorator, ListDecorator } =
  WalnutCrudDecorators({
    title: AppConstLogOperateTitle.APP_SETTING,
    DTO: AppSettingDto,
  });

@ApiTags('app/setting')
@Controller('app/setting')
@UseGuards(JwtAccessGuard)
export class AppSettingController {
  constructor(private readonly settingService: AppSettingService) {}

  @CreateDecorator()
  @HasPermission(AppConstPermissionAppSetting.CREATE)
  async create(
    @WalnutUser() user: IWalnutTokenPayload,
    @Body() payload: AppSettingDto,
  ) {
    return await this.settingService.create(payload, user);
  }

  @Get('auth')
  @Public()
  async getAuthSettings() {
    return await this.settingService.getAuthSettings();
  }

  @ReadDecorator()
  @HasPermission(AppConstPermissionAppSetting.READ)
  async read(@WalnutIdParamDecorator() id: string) {
    return await this.settingService.read(id);
  }

  @UpdateDecorator()
  @HasPermission(AppConstPermissionAppSetting.UPDATE)
  async update(@Body() payload: AppSettingDto) {
    return await this.settingService.update(payload);
  }

  @ListDecorator()
  @HasPermission(AppConstPermissionAppSetting.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<AppSettingDto>) {
    return await this.settingService.findAll(params);
  }
}
