import { ValueOf } from 'easy-fns-ts';

export const AppConstSettingType = {
  DEFAULT: 'default',
  AUTH: 'auth',
  VERIFY_CODE: 'verifyCode',
} as const;

export type AppConstSettingTypeType = ValueOf<typeof AppConstSettingType>;
