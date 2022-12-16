import { AppConstResponseCode } from '@/const/app/responseCode';
import { WalnutBadRequestException } from '../base.exception';

export class WalnutExceptionFunctionalityDisabled extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['8888'],
    });
  }
}

export class WalnutExceptionEndPointDisabled extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['7777'],
    });
  }
}
