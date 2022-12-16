import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';

import { AppConstRoleMeta, AppConstRoleModeType } from '@/const/decorator/role';
import { AppConstRolesType } from '@/const/role';

import { RolesGuard } from '../../guard/roles.guard';

/**
 * @description Custom role decorator, support for `role(s)` and mode controll
 * !!! NOTICE !!! if you want to use `HasRole` on controller level, MAKE SURE to put this decorator BEFORE jwt guard
 * Otherwise `request.user` will be undefined in context access
 * @link https://github.com/nestjs/docs.nestjs.com/issues/1567#issuecomment-731808138
 */
export const HasRole = (
  roles: AppConstRolesType | AppConstRolesType[],
  mode: AppConstRoleModeType = 'and',
) => {
  return applyDecorators(
    SetMetadata(AppConstRoleMeta.ROLE, roles),
    SetMetadata(AppConstRoleMeta.ROLE_MODE, mode),
    UseGuards(RolesGuard),
  );
};
