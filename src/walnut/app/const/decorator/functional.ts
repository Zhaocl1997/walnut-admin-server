import { ValueOf } from 'easy-fns-ts';

export const AppConstFunctionalMeta = {
  SETTING: 'SETTING_VALUE',
} as const;

export type AppConstFunctionalMetaType = ValueOf<typeof AppConstFunctionalMeta>;
