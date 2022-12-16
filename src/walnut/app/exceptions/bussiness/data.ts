import { AppConstResponseCode } from '../../const/app/responseCode';

import {
  WalnutBadRequestException,
  WalnutNotAcceptableException,
} from '../base.exception';

export class WalnutExceptionDataExisted extends WalnutBadRequestException {
  constructor(existedFields?: string) {
    super({
      errMsg: existedFields,
      errCode: AppConstResponseCode['4020'],
    });
  }
}

export class WalnutExceptionDataNotFound extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4021'],
    });
  }
}

export class WalnutExceptionDataDeleteError extends WalnutBadRequestException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4022'],
    });
  }
}

export class WalnutExceptionDataInvalid extends WalnutNotAcceptableException {
  constructor(extraFields: string) {
    super({
      errMsg: extraFields,
      errCode: AppConstResponseCode['4023'],
    });
  }
}

export class WalnutExceptionBadId extends WalnutNotAcceptableException {
  constructor() {
    super({
      errCode: AppConstResponseCode['4030'],
    });
  }
}
