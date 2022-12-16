import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { ApiWalnutOkResponse } from '@/decorators/swagger/response.decorator';

import { RefreshDTO } from '../dto/auth.dto';
import { RefreshEntity } from '../entities/auth.entity';

import { AuthRefreshService } from '../services/refresh.service';
import { JwtRefreshGuard } from '../guards/jwt/jwt-refresh.guard';
import { WalnutUser } from '@/decorators/user.decorator';

@ApiTags('auth/refresh')
@Controller('auth/refresh')
export class AuthRefreshController {
  constructor(private readonly authRefreshService: AuthRefreshService) {}

  @UseGuards(JwtRefreshGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(RefreshEntity)
  @ApiWalnutOkResponse({
    description:
      'Use refresh_token to get new accessToken, refreshToken is in body',
    DTO: RefreshEntity,
  })
  async refresh(
    @WalnutUser() user: IWalnutTokenPayload,
    @Body() payload: RefreshDTO,
  ) {
    const newToken = await this.authRefreshService.refreshAccessToken(user);

    return new RefreshEntity({
      accessToken: newToken,
    });
  }
}
