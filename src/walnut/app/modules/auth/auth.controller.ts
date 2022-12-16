import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { JwtAccessGuard } from './guards/jwt/jwt-access.guard';
import { ApiWalnutOkResponse } from '../../decorators/swagger/response.decorator';
import { SysUserDto } from '../business/system/user/dto/user.dto';
import { SysMenuDto } from '../business/system/menu/dto/menu.dto';
import { WalnutApiResponseSchemeData } from '../../decorators/swagger/ok.response';
import { EncryptResponseAesDecorator } from '../../decorators/walnut/encrypt.decorator';
import { SysUserEntity } from '../business/system/user/entities/user.entity';
import { WalnutUser } from '@/decorators/user.decorator';
import { SysRoleEntity } from '../business/system/role/entities/role.entity';

@ApiTags('auth')
@Controller('auth')
@UseGuards(JwtAccessGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiWalnutOkResponse({
    description: 'Get current user profile',
    DTO: SysUserDto,
  })
  async getProfile(@WalnutUser() user: IWalnutTokenPayload) {
    const { user: userProfile, roleNames } =
      await this.authService.getUserProfile(user.userName);

    return {
      user: new SysUserEntity(userProfile.toObject()),
      roleNames,
    };
  }

  @Get('permissions')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get current user permission menus',
    schema: WalnutApiResponseSchemeData({
      type: 'array',
      items: {
        allOf: [{ $ref: getSchemaPath(SysMenuDto) }],
      },
    }),
  })
  async getPermissionMenus(@WalnutUser() user: IWalnutTokenPayload) {
    return await this.authService.getPermissionMenus(user.roleIds);
  }

  @Get('keys')
  @HttpCode(HttpStatus.OK)
  @EncryptResponseAesDecorator()
  async getSecretKeys() {
    return await this.authService.getSecretKeys();
  }
}
