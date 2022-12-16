import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { SharedAreaService } from './area.service';

@ApiTags('shared/area')
@Controller('shared/area')
@UseGuards(JwtAccessGuard)
export class SharedAreaController {
  constructor(private SharedAreaService: SharedAreaService) {}

  @Get('/getChildrenByPcodeWithCache')
  async getChildrenByPcodeWithCache(@Query('pcode') pcode: string) {
    return await this.SharedAreaService.getChildrenByPcodeWithCache(pcode);
  }

  @Get('/feedback')
  async feedback(@Query('code') code: string) {
    return await this.SharedAreaService.feedback(code);
  }

  @Get('/feedback/multiple')
  async feedbackMultiple(@Query('codes') codes: string) {
    return await this.SharedAreaService.feedbackMultuple(codes);
  }
}
