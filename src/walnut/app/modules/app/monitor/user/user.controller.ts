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

import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { AppMonitorUserService } from './user.service';
import { Public } from '@/decorators/app/public';
import { WalnutCrudDecorators } from '@/decorators/crud';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { AppMonitorUserDTO } from './dto/user.dto';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';

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

  @Post('initial')
  @HttpCode(HttpStatus.OK)
  @Public()
  async monitor(
    @Req() req: IWalnutRequest,
    @Body() data: Partial<AppMonitorUserDTO>,
  ) {
    await this.monitorUserService.initial(req, data);
  }
}
