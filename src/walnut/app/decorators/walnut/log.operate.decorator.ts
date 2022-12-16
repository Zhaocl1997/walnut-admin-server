import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import {
  AppConstLogOperateActionType,
  AppConstLogOperateMeta,
  AppConstLogOperateTitleType,
} from '../../const/decorator/logOperate';

import { LogOperateInterceptor } from '../../interceptors/request/log.operate.interceptor';

export interface LogOperateOptions {
  title: AppConstLogOperateTitleType;
  action?: AppConstLogOperateActionType;
  needOperateLog?: boolean;
}

/**
 * @description Custom operate log decorator, normally used for create/update/delete/export/import actions
 */
export const LogOperateDecorator = (log: LogOperateOptions) => {
  return applyDecorators(
    SetMetadata(AppConstLogOperateMeta.LOG_TITLE, log.title),
    SetMetadata(AppConstLogOperateMeta.LOG_ACTION, log.action),
    UseInterceptors(LogOperateInterceptor),
  );
};
