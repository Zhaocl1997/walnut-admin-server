import { AppConstResponseCode } from '../../const/app/responseCode';

import {
  WalnutBadRequestException,
  WalnutUnauthorizedException,
} from '../base.exception';

export class WalnutExceptionAccessTokenExpired extends WalnutUnauthorizedException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4001'],
    });
  }
}

export class WalnutExceptionRefreshTokenExpired extends WalnutUnauthorizedException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4002'],
    });
  }
}

export class WalnutExceptionAccessDenied extends WalnutUnauthorizedException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4003'],
    });
  }
}

export class WalnutExceptionOauthFailed extends WalnutUnauthorizedException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4004'],
    });
  }
}

export class WalnutExceptionUserNotFound extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4010'],
    });
  }
}

export class WalnutExceptionUserExist extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4009'],
    });
  }
}

export class WalnutExceptionPassNotValid extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4011'],
    });
  }
}

export class WalnutExceptionUserBannedToSignin extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4012'],
    });
  }
}
