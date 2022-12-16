import {
  BadRequestException,
  UnauthorizedException,
  NotAcceptableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppConstResponseCode } from '../const/app/responseCode';

export class WalnutBadRequestException extends BadRequestException {
  constructor({ errCode, errMsg = `response.${errCode}` }) {
    super({ errType: BadRequestException.name, errCode, errMsg });
  }
}

export class WalnutUnauthorizedException extends UnauthorizedException {
  constructor({ errCode, errMsg = `response.${errCode}` }) {
    super({ errType: UnauthorizedException.name, errCode, errMsg });
  }
}

export class WalnutNotAcceptableException extends NotAcceptableException {
  constructor({ errCode, errMsg = `response.${errCode}` }) {
    super({ errType: NotAcceptableException.name, errCode, errMsg });
  }
}

export class WalnutExceptionCustom extends BadRequestException {
  constructor(errMsg?: string) {
    super({
      errType: BadRequestException.name,
      errMsg,
      errCode: AppConstResponseCode['9999'],
    });
  }
}

export class WalnutExceptionInternalServer extends InternalServerErrorException {
  constructor(errMsg?: string) {
    super({
      errType: InternalServerErrorException.name,
      errCode: AppConstResponseCode['5000'],
      errMsg,
    });
  }
}
