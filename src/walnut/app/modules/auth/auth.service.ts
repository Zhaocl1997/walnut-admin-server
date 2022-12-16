import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MergeType } from 'mongoose';
import { compare } from 'bcrypt';

import { SysUserService } from '../business/system/user/user.service';
import {
  WalnutExceptionPassNotValid,
  WalnutExceptionUserBannedToSignin,
  WalnutExceptionUserNotFound,
} from '../../exceptions/bussiness/auth';
import { RequestEncryption } from '../../utils/vendor/crypto';
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
  async checkUserCanContinue(payload: {
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
  async validateUserPassword(
    payloadName: string,
    pass: string,
  ): Promise<IWalnutTokenUser> {
    // check user existence through user name
    const isExisted = await this.userService.checkUserExistence({
      userName: payloadName,
    });

    // if no exist, just throw the error
    // cause password only stands for a signin action
    if (!isExisted) {
      throw new WalnutExceptionUserNotFound();
    }

    // get all relative user info
    const { user, roleIds, roleNames } =
      await this.userService.getUserRoleByCondition({
        userName: payloadName,
      });

    // local password check password is valid or not
    // decrypt the password and compare
    const key = this.configService.get<string>('crypto.request.key');
    const iv = this.configService.get<string>('crypto.request.iv');

    try {
      const decryptedPassword = RequestEncryption.decrypt(pass, key, iv);

      const isPassValid = await compare(decryptedPassword, user.password);

      // password invalid
      if (!isPassValid) {
        throw new WalnutExceptionPassNotValid();
      }
    } catch {
      throw new WalnutExceptionPassNotValid();
    }

    // last step to check whether user is banned ot user's all role is banned
    return await this.checkUserCanContinue({ user, roleIds, roleNames });
  }

  /**
   * @description validate user email address
   */
  async validateUserEmail(
    payloadEmail: string,
    verifyCode: string,
    language: string,
  ): Promise<IWalnutTokenUser> {
    // check user existence through email address
    const isExisted = await this.userService.checkUserExistence({
      emailAddress: payloadEmail,
    });

    // if no exist, this means new user, it's a signup
    // do the simple insert
    if (!isExisted) {
      const { emailAddress } = await this.userService.create({
        emailAddress: payloadEmail,
        userName: payloadEmail,
      });

      // send welcome email
      await this.mailerService.sendWelcome(emailAddress, language);
    }

    // get all relative user info
    const { user, roleIds, roleNames } =
      await this.userService.getUserRoleByCondition({
        emailAddress: payloadEmail,
      });

    // check the verify code with the one in cache
    const cacheCode = await this.cacheService.get(payloadEmail);
    if (+cacheCode !== +verifyCode) {
      throw new WalnutExceptionVerifyCodeError();
    }

    // last step to check whether user is banned ot user's all role is banned
    return await this.checkUserCanContinue({ user, roleIds, roleNames });
  }

  /**
   * @description validate user phone number
   */
  async validateUserPhone(
    payloadPhone: string,
    verifyCode: string,
  ): Promise<IWalnutTokenUser> {
    // check user existence through phone number
    const isExisted = await this.userService.checkUserExistence({
      phoneNumber: payloadPhone,
    });

    async function insert(service: typeof this.userService) {
      // if no exist, this means new user, it's a signup
      // do the simple insert
      if (!isExisted) {
        await service.create({
          phoneNumber: payloadPhone,
          userName: payloadPhone,
        });
      }
    }

    // insert to database
    await insert(this.userService);

    // get all relative user info
    const { user, roleIds, roleNames } =
      await this.userService.getUserRoleByCondition({
        phoneNumber: payloadPhone,
      });

    // check the verify code with the one in cache
    const cacheCode = await this.cacheService.get(payloadPhone);
    if (+cacheCode !== +verifyCode) {
      throw new WalnutExceptionVerifyCodeError();
    }

    // last step to check whether user is banned ot user's all role is banned
    return await this.checkUserCanContinue({ user, roleIds, roleNames });
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
