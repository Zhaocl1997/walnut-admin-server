import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../guards/jwt/jwt-access.guard';
import { AuthFingerprintService } from '../services/fingerprint.service';

@ApiTags('auth/fp')
@Controller('auth/fp')
export class AuthFingerPrintController {
  constructor(private readonly authFPService: AuthFingerprintService) {}

  @Post('set')
  @HttpCode(HttpStatus.OK)
  async setFPID(@Req() req: IWalnutRequest) {
    await this.authFPService.setFPID(req.fingerprint);
    return true;
  }

  @Delete('del')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  async clearFingerprint(@Req() req: IWalnutRequest) {
    await this.authFPService.delFPID(req.fingerprint);
    return true;
  }
}
