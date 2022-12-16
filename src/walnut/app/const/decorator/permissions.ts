import { ValueOf } from 'easy-fns-ts';

export const AppConstPermissionMeta = {
  PERMISSION: 'WALNUT_META_PERMISSION',
  PERMISSION_MODE: 'WALNUT_META_PERMISSION_MODE',
} as const;

export const AppConstPermissionMode = {
  AND: 'and',
  OR: 'or',
} as const;

/**
 * @description This requires permission to be a string array
 * `and` means current user need to match *all the permission strings passed in*
 * `or` means current user only need to match *one of all the permission strings passed in*
 * @default and
 */
export type AppConstPermissionModeType = ValueOf<typeof AppConstPermissionMode>;
