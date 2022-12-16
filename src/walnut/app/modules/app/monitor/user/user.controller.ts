import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PlainBody } from '@/decorators/plainBody.decorator';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { AppMonitorUserService } from './user.service';
import { Public } from '@/decorators/app/public';
import { WalnutCrudDecorators } from '@/decorators/crud';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppMonitorUserDTO } from './dto/user.dto';

const { ListDecorator } = WalnutCrudDecorators({
  DTO: '',
});

@ApiTags('app/monitor/user')
@Controller('app/monitor/user')
@UseGuards(JwtAccessGuard)
export class AppMonitorUserController {
  private readonly logger = new Logger('Monitor - User');

  constructor(private readonly monitorUserService: AppMonitorUserService) {}

  @ListDecorator()
  // @HasPermission(AppConstPermissionUser.LIST)
  async findAll(@Body() params: WalnutListRequestDTO<AppMonitorUserDTO>) {
    return await this.monitorUserService.findAll(params);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @Public()
  async monitor(@Req() req: IWalnutRequest, @Body() data) {
    await this.monitorUserService.core(
      {
        visitorId: data.visitorId,
        auth: data?.auth ?? false,
        focus: data?.focus ?? false,
        left: data?.left ?? true,
        currentRouter: data?.currentRouter,
        userId: data?.userId,
        userName: data?.userName ?? '',
        location: data?.location,
      },
      req,
    );
  }
}
