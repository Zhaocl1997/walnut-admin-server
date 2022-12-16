import { AppConstResponseCode } from '@/const/app/responseCode';
import { WalnutBadRequestException } from '../base.exception';

export class WalnutExceptionSendTextMessageError extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4102'],
    });
  }
}
