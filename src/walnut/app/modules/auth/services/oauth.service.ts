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
   * logic almost the same as `validateUserEmail`
   */
  async validateOauthUser(
    username: string,
    provider: string,
    providerId: string,
    language: string,

    avatar?: string,
    email?: string,
    phone?: string,
  ): Promise<IWalnutTokenUser> {
    // check user existence through email address
    const isExisted = await this.userService.checkUserExistence({
      userName: username,
      emailAddress: email ?? undefined,
      phoneNumber: phone ?? undefined,
    });

    // if no exist, this means new user, it's a signup
    // do the simple insert
    if (!isExisted) {
      const { emailAddress, _id } = await this.userService.create({
        userName: username,
        emailAddress: email ?? undefined,
        avatar: avatar ?? undefined,
        phoneNumber: phone ?? undefined,
      });

      // insert oauth information
      await this.oauthService.create({
        provider,
        providerId,
        userId: _id.toString(),
      });

      // send welcome email
      await this.mailerService.sendWelcome(emailAddress, language);
    }

    // get all relative user info
    const { user, roleIds, roleNames } =
      await this.userService.getUserRoleByCondition({
        userName: username,
        emailAddress: email ?? undefined,
        phoneNumber: phone ?? undefined,
      });

    // last step to check whether user is banned ot user's all role is banned
    return await this.authService.checkUserCanContinue({
      user,
      roleIds,
      roleNames,
    });
  }
}
