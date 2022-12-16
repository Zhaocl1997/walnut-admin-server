import { ValueOf } from 'easy-fns-ts';

export const AppConstCacheKeys = {
  PROVINCE: 'WALNUT_CACHE_AREA_PROVINCE',
  CITY: 'WALNUT_CACHE_AREA_CITY',
  AREA: 'WALNUT_CACHE_AREA_AREAS',
  STREET: 'WALNUT_CACHE_AREA_STREET',
  VILLAGE: 'WALNUT_CACHE_AREA_VILLAGE',

  APP_SETTING: 'APP_SETTING',
} as const;

export const AppConstCacheType = {
  BUILT_IN: 'built-in',
  AUTH_PERMISSIONS: 'auth-permissions',
  AUTH_ROLE_NAMES: 'auth-roleNames',
  VERIFY_CODE: 'verify-code',
  LOCALES: 'locales',
  FINGERPRINT: 'fingerprint',
  MONITOR: 'monitor',
  // TODO
  AREA: 'area',
} as const;

export type AppConstCacheTypeType = ValueOf<typeof AppConstCacheType>;

export const AppConstSettingKeys = {
  DEFAULT_PASSWORD: 'app.default.password',
  DEFAULT_ROLE: 'app.default.role',

  APP_AUTH_ACCOUNT: 'app.auth.account',
  APP_AUTH_EMAIL: 'app.auth.email',
  APP_AUTH_PHONE: 'app.auth.phone',
  APP_AUTH_QR: 'app.auth.qrcode',
  APP_AUTH_GITEE: 'app.auth.gitee',
  APP_AUTH_GITHUB: 'app.auth.github',
  APP_AUTH_WEIBO: 'app.auth.weibo',

  VERIFY_EMIAL_SEND: 'app.verify.email.send',
  VERIFY_EMIAL_TTL: 'app.verify.email.ttl',
  VERIFY_EMIAL_FIGURE: 'app.verify.email.figure',

  VERIFY_PHONE_SEND: 'app.verify.phone.send',
  VERIFY_PHONE_TTL: 'app.verify.phone.ttl',
  VERIFY_PHONE_FIGURE: 'app.verify.phone.figure',
} as const;

export type AppConstSettingKeysType = ValueOf<typeof AppConstSettingKeys>;
