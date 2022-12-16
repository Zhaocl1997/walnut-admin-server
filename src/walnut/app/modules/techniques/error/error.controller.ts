import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Error } from 'mongoose';

import { JwtAccessGuard } from '@/modules/auth/guards/jwt/jwt-access.guard';
import { AppConstRoles } from '@/const/role';
import { HasRole } from '@/decorators/walnut/hasRole.decorator';
import {
  WalnutExceptionCustom,
  WalnutExceptionInternalServer,
} from '@/exceptions/base.exception';
import {
  WalnutExceptionAccessDenied,
  WalnutExceptionAccessTokenExpired,
  WalnutExceptionPassNotValid,
  WalnutExceptionRefreshTokenExpired,
  WalnutExceptionUserBannedToSignin,
  WalnutExceptionUserExist,
  WalnutExceptionUserNotFound,
} from '@/exceptions/bussiness/auth';
import {
  WalnutExceptionBadId,
  WalnutExceptionDataDeleteError,
  WalnutExceptionDataInvalid,
  WalnutExceptionDataExisted,
  WalnutExceptionDataNotFound,
} from '@/exceptions/bussiness/data';
import { WalnutExceptionIPNotAcceptable } from '@/exceptions/middleware/ip';
import {
  WalnutExceptionUserAgentBrowserNotAcceptable,
  WalnutExceptionUserAgentNotAcceptable,
  WalnutExceptionUserAgentOSNotAcceptable,
} from '@/exceptions/middleware/user-agent';
import { HasPermission } from '@/decorators/walnut/hasPermission.decorator';
import { AppConstPermissionError } from '@/const/permissions/error';
import { WalnutExceptionSendEmailError } from '@/exceptions/bussiness/email';
import { WalnutExceptionSendTextMessageError } from '@/exceptions/bussiness/phone';

@ApiTags('app/error')
@Controller('app/error')
@HasRole(AppConstRoles.ADMIN)
@HasPermission(AppConstPermissionError.TEST)
@UseGuards(JwtAccessGuard)
export class AppErrorController {
  constructor() {}

  @Get('4001')
  error4001() {
    return new WalnutExceptionAccessTokenExpired();
  }

  @Get('4002')
  error4002() {
    return new WalnutExceptionRefreshTokenExpired();
  }

  @Get('4003')
  error4003() {
    return new WalnutExceptionAccessDenied();
  }

  @Get('4009')
  error4009() {
    return new WalnutExceptionUserExist();
  }

  @Get('4010')
  error4010() {
    return new WalnutExceptionUserNotFound();
  }

  @Get('4011')
  error4011() {
    return new WalnutExceptionPassNotValid();
  }

  @Get('4012')
  error4012() {
    return new WalnutExceptionUserBannedToSignin();
  }

  @Get('4020')
  error4020() {
    return new WalnutExceptionDataExisted('some existed fields');
  }

  @Get('4021')
  error4021() {
    return new WalnutExceptionDataNotFound();
  }

  @Get('4022')
  error4022() {
    return new WalnutExceptionDataDeleteError();
  }

  @Get('4023')
  error4023() {
    return new WalnutExceptionDataInvalid('some extra fields');
  }

  @Get('4030')
  error4030() {
    return new WalnutExceptionBadId();
  }

  //   @Get('4040')
  //   error4040() {
  //     return new WalnutExceptionDataInvalid('');
  //   }

  @Get('4060')
  error4060() {
    return new WalnutExceptionUserAgentNotAcceptable();
  }

  @Get('4061')
  error4061() {
    return new WalnutExceptionUserAgentOSNotAcceptable();
  }

  @Get('4062')
  error4062() {
    return new WalnutExceptionUserAgentBrowserNotAcceptable();
  }

  @Get('4063')
  error4063() {
    return new WalnutExceptionIPNotAcceptable();
  }

  @Get('4101')
  error4101() {
    return new WalnutExceptionSendEmailError();
  }

  @Get('4102')
  error4102() {
    return new WalnutExceptionSendTextMessageError();
  }

  //   @Get('4290')
  //   error4290() {
  //     return new WalnutExceptionDataInvalid();
  //   }

  @Get('5000')
  error5000() {
    return new WalnutExceptionInternalServer('what error it is ?');
  }

  @Get('5555')
  error5555() {
    return new Error.ValidationError();
  }

  @Get('9999')
  error9999() {
    return new WalnutExceptionCustom(
      'This is a custom error msg, which is not translated by i18n.',
    );
  }

  @Get('9999/t')
  error9999t() {
    return new WalnutExceptionCustom('response.custom');
  }
}
