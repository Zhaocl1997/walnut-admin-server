import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SharedAliService } from './ali.service';

import { EncryptResponseAesDecorator } from '@/decorators/walnut/encrypt.decorator';
import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';

@ApiTags('shared/ali')
@Controller('shared/ali')
@UseGuards(JwtAccessGuard)
export class SharedAliController {
  constructor(private SharedAliService: SharedAliService) {}

  @Get('/sts')
  @EncryptResponseAesDecorator()
  async getSTSToken() {
    return await this.SharedAliService.getSTSToken();
  }
}
