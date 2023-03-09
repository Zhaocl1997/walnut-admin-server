import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MergeType } from 'mongoose';

import { SysUserService } from '../business/system/user/user.service';
import {
  WalnutExceptionUserBannedToSignin,
  WalnutExceptionUserNotFound,
} from '../../exceptions/bussiness/auth';
import { AppPermissionService } from '../shared/permission/permission.service';

import { SysUserDocument } from '@/modules/business/system/user/schema/user.schema';
import { SysRoleDocument } from '@/modules/business/system/role/schema/role.schema';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { WalnutExceptionVerifyCodeError } from '@/exceptions/bussiness/email';
import { AppMailerService } from '../shared/mailer/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: SysUserService,
    private readonly permissionService: AppPermissionService,
    private readonly configService: ConfigService,
    private readonly cacheService: AppCacheService,
    private readonly mailerService: AppMailerService,
  ) {}

  /**
   * @description check user can continue or not
   * Last Step
   */
  async checkUserStatus(payload: {
    user: MergeType<SysUserDocument, { role: SysRoleDocument[] }>;
    roleIds: string[];
    roleNames: string[];
  }): Promise<IWalnutTokenUser> {
    const { user, roleIds, roleNames } = payload;

    const { _id, role, userName, status, emailAddress, phoneNumber } = user;

    // user banned to signin
    if (!status) {
      throw new WalnutExceptionUserBannedToSignin();
    }

    // if no role is populated
    // this means all role bind to this user has been banned
    if (role.length === 0) {
      throw new WalnutExceptionUserBannedToSignin();
    }

    return {
      userId: _id.toString(),
      userName,
      roleIds,
      roleNames,
      emailAddress,
      phoneNumber,
    };
  }

  /**
   * @description validate user password
   */
  async _validateUserPassword(
    payloadName: string,
    pass: string,
  ): Promise<IWalnutTokenUser> {
    const isExisted = await this.userService.findUser({
      userName: payloadName,
    });

    // if no exist, just throw the error
    // cause password only stands for a signin action
    if (!isExisted) {
      throw new WalnutExceptionUserNotFound();
    }

    const { user, roleIds, roleNames } =
      await this.userService.insertUserIfNotExisted({
        userName: payloadName,
      });

    // validate the encrypted password
    await this.userService.compareEncryptedUserPassword(pass, user.password);

    // last step to check whether user is banned ot user's all role is banned
    return await this.checkUserStatus({ user, roleIds, roleNames });
  }

  /**
   * @description validate user email address
   */
  async _validateUserEmail(
    payloadEmail: string,
    verifyCode: string,
    language: string,
  ): Promise<IWalnutTokenUser> {
    // Step 1 - check the verify code with the one in cache
    const cacheCode = await this.cacheService.get(payloadEmail);
    if (+cacheCode !== +verifyCode) {
      throw new WalnutExceptionVerifyCodeError();
    }

    // send the welcome email
    const cb = async ({ emailAddress }) => {
      await this.mailerService.sendWelcome(emailAddress, language);
    };

    // Step 2 - go to db to check user existed or not
    // no existed, system will auto create a default user
    const { user, roleIds, roleNames } =
      await this.userService.insertUserIfNotExisted(
        {
          userName: payloadEmail,
          emailAddress: payloadEmail,
        },
        cb,
      );

    // Step 3 - check status and return token payload
    return await this.checkUserStatus({ user, roleIds, roleNames });
  }

  /**
   * @description validate user phone number
   */
  async _validateUserPhone(
    payloadPhone: string,
    verifyCode: string,
  ): Promise<IWalnutTokenUser> {
    // Step 1 - check the verify code with the one in cache
    const cacheCode = await this.cacheService.get(payloadPhone);
    if (+cacheCode !== +verifyCode) {
      throw new WalnutExceptionVerifyCodeError();
    }

    // Step 2 - go to db to check user existed or not
    // no existed, system will auto create a default user
    const { user, roleIds, roleNames } =
      await this.userService.insertUserIfNotExisted({
        userName: payloadPhone,
        phoneNumber: payloadPhone,
      });

    // Step 3 - check status and return token payload
    return await this.checkUserStatus({ user, roleIds, roleNames });
  }

  /**
   * @description get current user authorized menus
   */
  async getPermissionMenus(roleIds: string[]) {
    return await this.permissionService.getPermissionMenus(roleIds);
  }

  /**
   * @description get crypto key and iv, also vendor service api keys
   */
  async getSecretKeys() {
    const keys = {
      B: this.configService.get('vendor.baidu'),
    };

    return keys;
  }

  /**
   * @description get user profile through userName
   */
  async getUserProfile(userName: string) {
    const { user, roleNames } = await this.userService.getUserRoleByCondition({
      userName,
    });

    return {
      user,
      roleNames,
    };
  }
}
