import { ValueOf } from 'easy-fns-ts';

export const AppConstRoles = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type AppConstRolesType = ValueOf<typeof AppConstRoles>;
