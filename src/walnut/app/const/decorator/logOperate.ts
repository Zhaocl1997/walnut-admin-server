import { ValueOf } from 'easy-fns-ts';

export const AppConstLogOperateAction = {
  OTHER: 'OTHER',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  DELETE_MANY: 'DELETE_MANY',
  IMPORT: 'IMPORT',
  EXPORT: 'EXPORT',
} as const;

export const AppConstLogOperateTitle = {
  USER: '用户',
  ROLE: '角色',
  MENU: '菜单',
  LANG: '语言',
  LOCALE: '国际化',
  DICT_TYPE: '字典类型',
  DICT_DATA: '字典数据',
  LOG_OPERATE: '操作日志',
  LOG_AUTH: '登录/注册日志',

  APP_SETTING: '应用设置',
  APP_CACHE: '应用缓存'
} as const;

export const AppConstLogOperateMeta = {
  LOG_TITLE: 'WALNUT_META_LOG_TITLE',
  LOG_ACTION: 'WALNUT_META_LOG_ACTION',
} as const;

export type AppConstLogOperateActionType = ValueOf<
  typeof AppConstLogOperateAction
>;

export type AppConstLogOperateTitleType = ValueOf<
  typeof AppConstLogOperateTitle
>;
