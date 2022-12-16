import { ValueOf } from 'easy-fns-ts';

export const AppConstAuthMeta = {
  TYPE: 'WALNUT_META_AUTH_TYPE',
} as const;

export const AppConstLogAuthType = {
  PWD: 'password',
  EMAIL: 'emailAddress',
  PHONE: 'phoneNumber',
  QR: 'qrcode',

  OTHER_QQ: 'qq',

  OTHER_GITHUB: 'github',
  OTHER_GITEE: 'gitee',
  OTHER_WEIBO: 'weibo',
  // ...
} as const;

export type AppConstLogAuthTypeType = ValueOf<typeof AppConstLogAuthType>;
