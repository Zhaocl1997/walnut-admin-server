import { PermissionGuard } from '@/guard/permission.guard';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  AppConstPermissionMeta,
  AppConstPermissionModeType,
} from '../../const/decorator/permissions';

/**
 * @description Custom permission decorator, support for `permission(s)` and mode controll
 * !!! NOTICE !!! if you want to use `HasPermission` on controller level, MAKE SURE to put this decorator BEFORE jwt guard
 * Otherwise `request.user` will be undefined in context access
 * @link https://github.com/nestjs/docs.nestjs.com/issues/1567#issuecomment-731808138
 */
export const HasPermission = (
  permission: string | string[],
  mode: AppConstPermissionModeType = 'and',
) => {
  return applyDecorators(
    SetMetadata(AppConstPermissionMeta.PERMISSION, permission),
    SetMetadata(AppConstPermissionMeta.PERMISSION_MODE, mode),
    UseGuards(PermissionGuard),
  );
};
