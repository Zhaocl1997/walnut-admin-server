import {
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  NotAcceptableException,
} from '@nestjs/common';
import { Error } from 'mongoose';
import { AppConstResponseCode } from '../const/app/responseCode';

import { WalnutResponseException } from './response';

/**
 * @description WalnutResponseException
 */
export const WalnutResponseExceptioneHandler = (
  e: HttpException,
): IWalnutResponseBase => {
  const mongoError = ['MongoServerError', Error.ValidationError.name];

  console.log(e);
  
  // a mongo server error
  if (mongoError.includes(e.name)) {
    return WalnutResponseException({
      errCode: AppConstResponseCode['5555'],
    });
  }

  // an error with http status code
  if (e.getStatus) {
    const HttpStatusCode = e.getStatus();
    const errResponse = e.getResponse() as IWalnutExceptionBase;

    switch (HttpStatusCode) {
      // 400
      case HttpStatus.BAD_REQUEST: {
        if (errResponse.errType === BadRequestException.name) {
          // get msg here, means custom error msg
          if (errResponse.errMsg) {
            return WalnutResponseException({
              errCode: errResponse.errCode,
              errMsg: errResponse.errMsg,
            });
          } else {
            return WalnutResponseException({ errCode: errResponse.errCode });
          }
        }
      }

      // 401
      case HttpStatus.UNAUTHORIZED:
        {
          if (errResponse.errType === UnauthorizedException.name) {
            return WalnutResponseException({ errCode: errResponse.errCode });
          }
        }

        break;

      // 404
      case HttpStatus.NOT_FOUND:
        {
          return WalnutResponseException({
            errCode: AppConstResponseCode['4040'],
          });
        }

        break;

      // 406
      case HttpStatus.NOT_ACCEPTABLE:
        {
          if (errResponse.errType === NotAcceptableException.name) {
            return WalnutResponseException({ errCode: errResponse.errCode });
          }
        }

        break;

      // 429 rate limit
      case HttpStatus.TOO_MANY_REQUESTS:
        return WalnutResponseException({
          errCode: AppConstResponseCode['4290'],
        });

        break;

      // 500
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return WalnutResponseException({
          errCode: AppConstResponseCode['5000'],
        });

        break;

      // unknown error
      default:
        return WalnutResponseException({
          errCode: AppConstResponseCode['5000'],
        });
        break;
    }
  }

  return WalnutResponseException({ errCode: AppConstResponseCode['5000'] });
};
