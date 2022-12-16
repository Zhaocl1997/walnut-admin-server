import { ValueOf } from 'easy-fns-ts';

export const AppConstRoleMeta = {
  ROLE: 'WALNUT_META_ROLE',
  ROLE_MODE: 'WALNUT_META_ROLE_MODE',
} as const;

export const AppConstRoleMode = {
  AND: 'and',
  OR: 'or',
} as const;

/**
 * @description This requires permission to be a string array
 * `and` means current user need to match *all the permission strings passed in*
 * `or` means current user only need to match *one of all the permission strings passed in*
 * @default and
 */
export type AppConstRoleModeType = ValueOf<typeof AppConstRoleMode>;
