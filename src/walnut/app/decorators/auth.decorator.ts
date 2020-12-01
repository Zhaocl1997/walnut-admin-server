import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { Roles } from './role.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

export const hasRole = (roles: string) => {
  return applyDecorators(
    Roles(roles),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
