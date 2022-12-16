import {
  AppConstAuthMeta,
  AppConstLogAuthTypeType,
} from '@/const/decorator/logAuth';
import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { LogAuthInterceptor } from '../../interceptors/request/log.auth.interceptor';

/**
 * @description Custom auth log decorator, only used for auth endpoint
 */
export const LogAuth = (type: AppConstLogAuthTypeType = 'password') => {
  return applyDecorators(
    SetMetadata(AppConstAuthMeta.TYPE, type),
    UseInterceptors(LogAuthInterceptor),
  );
};
