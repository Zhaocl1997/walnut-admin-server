import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { SysUserModule } from '../business/system/user/user.module';
import { SysUserOauthModule } from '../business/system/user_oauth/user_oauth.module';

import { LocalPasswordStrategy } from './strategies/local/local-password.strategy';
import { LocalEmailStrategy } from './strategies/local/local-email.strategy';
import { LocalPhoneStrategy } from './strategies/local/local-phone.strategy';
import { JwtAccessTokenStrategy } from './strategies/jwt/jwt-access.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt/jwt-refresh.strategy';

import { AuthOauthGiteeStrategy } from './strategies/oauth/gitee.strategy';
import { AuthOauthGitHubStrategy } from './strategies/oauth/github.strategy';
import { AuthOauthWeiboStrategy } from './strategies/oauth/weibo.strategy';

import { AuthPwdController } from './controllers/pwd.controller';
import { AuthRefreshController } from './controllers/refresh.controller';
import { AuthEmailController } from './controllers/email.controller';
import { AuthPhoneController } from './controllers/phone.controller';
import { AuthThirdPartyGithubController } from './controllers/github.controller';
import { AuthThirdPartyGiteeController } from './controllers/gitee.controller';
import { AuthThirdPartyWeiboController } from './controllers/weibo.controller';

import { AuthPwdService } from './services/pwd.service';
import { AuthRefreshService } from './services/refresh.service';
import { AuthEmailService } from './services/email.service';
import { AuthPhoneService } from './services/phone.service';

import { SysLogAuthModule } from '../business/system/logs/auth/log.auth.module';
import { AppPermissionModule } from '../shared/permission/permission.module';
import { AppTokenModule } from '../shared/token/token.module';

import { AppSmsModule } from '@/modules/shared/sms/sms.module';
import { AppMailerModule } from '@/modules/shared/mailer/mailer.module';

import { UtilServiceVeriyCode } from '../shared/utils/verifyCode';
import { AuthFingerPrintController } from './controllers/fingerprint.controller';
import { AuthFingerprintService } from './services/fingerprint.service';
import { AuthOauthService } from './services/oauth.service';

// https://gitee.com/oauth/applications
// https://github.com/settings/developers
// https://open.weibo.com/developers/identity

const controllers = [
  AuthPwdController,
  AuthEmailController,
  AuthPhoneController,

  AuthRefreshController,

  AuthThirdPartyGithubController,
  AuthThirdPartyGiteeController,
  AuthThirdPartyWeiboController,
];

const strategies = [
  // local
  LocalPasswordStrategy,
  LocalEmailStrategy,
  LocalPhoneStrategy,

  // jwt
  JwtAccessTokenStrategy,
  JwtRefreshTokenStrategy,

  // oauth
  AuthOauthGiteeStrategy,
  AuthOauthGitHubStrategy,
  AuthOauthWeiboStrategy,
];

@Module({
  imports: [
    HttpModule,

    SysUserModule,
    SysUserOauthModule,
    SysLogAuthModule,

    AppPermissionModule,
    AppTokenModule,

    AppSmsModule,
    AppMailerModule,
  ],
  controllers: [AuthController, AuthFingerPrintController, ...controllers],
  providers: [
    // base auth serivce
    AuthService,
    AuthFingerprintService,

    ...strategies,

    // common auth
    AuthPwdService,
    AuthRefreshService,
    AuthEmailService,
    AuthPhoneService,

    // third oauth
    AuthOauthService,

    UtilServiceVeriyCode,
  ],
  exports: [AuthService],
})
export class AuthModule {}
