import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';

import { SysUserService } from '@/modules/business/system/user/user.service';
import { AppMailerService } from '@/modules/shared/mailer/mailer.service';
import { SysUserOauthService } from '@/modules/business/system/user_oauth/user_oauth.serivce';

@Injectable()
export class AuthOauthService {
  constructor(
    private readonly userService: SysUserService,
    private readonly mailerService: AppMailerService,
    private readonly authService: AuthService,
    private readonly oauthService: SysUserOauthService,
  ) {}

  /**
   * @description validate user from gitee
   */
  async _validateUserOauth(
    username: string,
    provider: string,
    providerId: string,
    language: string,

    avatar?: string,
    email?: string,
    phone?: string,
  ): Promise<IWalnutTokenUser> {
    const cb = async ({ _id, emailAddress }) => {
      // insert oauth information
      await this.oauthService.create({
        provider,
        providerId,
        userId: _id.toString(),
      });

      // send welcome email
      await this.mailerService.sendWelcome(emailAddress, language);
    };
    
    const { user, roleIds, roleNames } =
      await this.userService.insertUserIfNotExisted(
        {
          userName: username,
          emailAddress: email ?? undefined,
          phoneNumber: phone ?? undefined,
        },
        cb,
      );

    // last step to check whether user is banned ot user's all role is banned
    return await this.authService.checkUserStatus({
      user,
      roleIds,
      roleNames,
    });
  }
}
