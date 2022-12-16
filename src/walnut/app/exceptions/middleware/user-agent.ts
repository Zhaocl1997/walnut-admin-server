import { AppConstResponseCode } from '@/const/app/responseCode';
import { WalnutNotAcceptableException } from '../base.exception';

export class WalnutExceptionUserAgentNotAcceptable extends WalnutNotAcceptableException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4060'],
    });
  }
}

export class WalnutExceptionUserAgentOSNotAcceptable extends WalnutNotAcceptableException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4061'],
    });
  }
}

export class WalnutExceptionUserAgentBrowserNotAcceptable extends WalnutNotAcceptableException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4062'],
    });
  }
}
