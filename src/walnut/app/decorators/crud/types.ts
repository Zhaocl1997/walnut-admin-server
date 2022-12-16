import { LogOperateOptions } from '../walnut/log.operate.decorator';
import { ApiWalnutOkResponseOptions } from '../swagger/response.decorator';

export interface WalnutCrudOptions {
  operateLog: LogOperateOptions;

  swagger: ApiWalnutOkResponseOptions;
}
