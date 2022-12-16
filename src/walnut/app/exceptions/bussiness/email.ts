import { AppConstResponseCode } from '@/const/app/responseCode';
import { WalnutBadRequestException } from '../base.exception';

export class WalnutExceptionSendEmailError extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4101'],
    });
  }
}

export class WalnutExceptionVerifyCodeError extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4024'],
    });
  }
}
