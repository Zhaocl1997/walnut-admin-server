import { AppConstResponseCode } from '@/const/app/responseCode';
import { WalnutNotAcceptableException } from '../base.exception';

export class WalnutExceptionIPNotAcceptable extends WalnutNotAcceptableException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4063'],
    });
  }
}
