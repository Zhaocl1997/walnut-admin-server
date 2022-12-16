import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('system/user/oauth')
@Controller('system/user/oauth')
@UseGuards(JwtAccessGuard)
export class SysUserOauthController {}
