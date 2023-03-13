import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { hash, compare } from 'bcrypt';

import { SysUserModel, SysUserDocument } from './schema/user.schema';

import { SysUserRepository } from './user.repository';
import { SysUserDto } from './dto/user.dto';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { SysRoleDocument } from '../role/schema/role.schema';
import {
  WalnutExceptionPassNotValid,
  WalnutExceptionRefreshTokenExpired,
} from '@/exceptions/bussiness/auth';
import { RequestEncryption } from '@/utils/vendor/crypto';
import { ConfigService } from '@nestjs/config';
import { AppCacheCustomService } from '@/modules/app/monitor/cache/cache.custom';
import { AppMonitorUserService } from '@/modules/app/monitor/user/user.service';

@Injectable()
export class SysUserService {
  constructor(
    @AppInjectModel(SysUserModel.name)
    private readonly sysUserModel: Model<SysUserDocument>,
    private readonly sysUserRepo: SysUserRepository,
    private readonly cacheSerice: AppCacheCustomService,
    private readonly configService: ConfigService,
    private readonly monitorUserSerivce: AppMonitorUserService,
  ) {}

  async findUser(payload: Partial<SysUserDto>) {
    return await this.sysUserModel.findOne(payload);
  }

  /**
   * @description used for PASSWORD/EMIAL/PHONE/OAUTH user find and return roleIds/roleNames
   */
  async insertUserIfNotExisted(
    payload: Partial<SysUserDto>,
    notExistedCallback: (
      user: Partial<SysUserModel>,
    ) => Promise<void> | void = () => {},
  ) {
    let _user: SysUserModel;

    const incomeUser = await this.sysUserModel.findOne(payload);

    if (!incomeUser) {
      _user = await this.createUser(payload, false);
      await notExistedCallback(_user);
    } else {
      _user = incomeUser;
    }

    const populatedUser = await _user.populate<{
      role: SysRoleDocument[];
    }>({
      path: 'role',
      match: {
        deleted: false,
        status: true,
      },
    });

    return {
      user: populatedUser,
      roleIds: populatedUser.role.map((i) => i._id.toString()),
      roleNames: populatedUser.role.map((i) => i.roleName),
    };
  }

  /**
   * @description set hashed refresh token into db
   */
  async setRefreshToken(refreshToken: string, userId: string) {
    const hashedRefreshToken = await hash(refreshToken, 10);
    return await this.sysUserModel.findOneAndUpdate(
      { _id: userId },
      {
        hashedRefreshToken,
      },
    );
  }

  /**
   * @description remove refresh token from db
   */
  async removeRefreshToken(userId: string) {
    return await this.sysUserModel.findOneAndUpdate(
      { _id: userId },
      {
        hashedRefreshToken: '',
      },
    );
  }

  /**
   * @description compare user password
   */
  decryptPassword(pass: string): string {
    // local password check password is valid or not
    // decrypt the password and compare
    const key = this.configService.get<string>('crypto.request.key');
    const iv = this.configService.get<string>('crypto.request.iv');

    try {
      return RequestEncryption.decrypt(pass, key, iv);
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  /**
   * @description compare user password
   */
  async compareEncryptedUserPassword(payload: string, original: string) {
    const decryptedPassword = this.decryptPassword(payload)

    const isPassValid = await compare(decryptedPassword, original);

    // password invalid
    if (!isPassValid) {
      throw new WalnutExceptionPassNotValid();
    }
  }

  /**
   * @description update user password, through save hook in user schema
   */
  async updateUserPassword(userId: string, newPass: string) {
    const user = await this.getUserByCondition({ _id: userId });

    const decryptedPassword = this.decryptPassword(newPass)   

    user.password = decryptedPassword;

    // trigger the hashed password through save hook
    await user.save();

    // force quit the user if user has auth state and current on the page
    await this.monitorUserSerivce.forceQuitByUserId(userId);

    return true;
  }

  /**
   * @description reset user password to the default, which is fetch from
   */
  async resetUserPasswordToDefault(userId: string) {
    const user = await this.getUserByCondition({ _id: userId });
    const DEFAULT_PASSWORD = await this.cacheSerice.getDefaultPassword();

    user.password = DEFAULT_PASSWORD;

    // trigger the hashed password through save hook
    await user.save();

    // force quit the user if user has auth state and current on the page
    await this.monitorUserSerivce.forceQuitByUserId(userId);

    return true;
  }

  /**
   * @description set hashed refresh token into db
   */
  async checkUserRefreshToken(userId: string, refreshToken: string) {
    const user = await this.getUserByCondition({ _id: userId });

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new WalnutExceptionRefreshTokenExpired();
    }
  }

  /**
   * @description get user through condition
   */
  async getUserByCondition(condition: Partial<SysUserDto>) {
    return await this.sysUserRepo.readByCondition(condition);
  }

  /**
   * @description get user with populated role through condition
   */
  async getUserRoleByCondition(condition: Partial<SysUserDto>) {
    const user = await this.getUserByCondition(condition);

    const populatedUser = await user.populate<{
      role: SysRoleDocument[];
    }>({
      path: 'role',
      match: {
        deleted: false,
        status: true,
      },
    });

    return {
      user: populatedUser,
      roleIds: populatedUser.role.map((i) => i._id.toString()),
      roleNames: populatedUser.role.map((i) => i.roleName),
    };
  }

  /**
   * @description get user role name list through condition
   */
  async getUserRoleNamesByCondition(condition: Partial<SysUserDto>) {
    const user = await this.getUserByCondition(condition);

    const populatedUser = await user.populate<{
      role: SysRoleDocument[];
    }>({
      path: 'role',
      match: {
        deleted: false,
        status: true,
      },
    });

    return populatedUser.role.map((i) => i.roleName);
  }

  // base CRUD
  async createUser(dto: Partial<SysUserDto>, needEntity = true) {
    const DEFAULT_PASSWORD = await this.cacheSerice.getDefaultPassword();
    const DEFAULT_ROLE = await this.cacheSerice.getDefaultRole();

    return await this.sysUserRepo.create(
      {
        ...dto,
        password: dto.password ?? DEFAULT_PASSWORD,
        role: dto.role ?? [DEFAULT_ROLE],
      },
      needEntity,
    );
  }

  async read(id: string) {
    return await this.sysUserRepo.readById(id);
  }

  async update(dto: SysUserDto) {
    return await this.sysUserRepo.update(dto);
  }

  async delete(id: string) {
    return await this.sysUserRepo.delete(id);
  }

  async deleteMany(ids: string) {
    return await this.sysUserRepo.deleteMany(ids);
  }

  async findAll(params: WalnutListRequestDTO<SysUserDto>) {
    return await this.sysUserRepo.list(params, [
      {
        $project: {
          userName: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
  }
}
