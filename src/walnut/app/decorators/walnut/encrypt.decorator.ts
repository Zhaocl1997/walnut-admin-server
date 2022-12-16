import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { WalnutEncryptResponseInterceptor } from '../../interceptors/response/encrypt.interceptor';

/**
 * @description AES encrypt response data
 */
export const EncryptResponseAesDecorator = () => {
  return applyDecorators(UseInterceptors(WalnutEncryptResponseInterceptor));
};
