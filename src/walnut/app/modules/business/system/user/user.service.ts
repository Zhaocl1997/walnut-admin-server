import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';
import { hash, compare } from 'bcrypt';

import { SysUserModel, SysUserDocument } from './schema/user.schema';

import { SysUserRepository } from './user.repository';
import { SysUserDto } from './dto/user.dto';
import { WalnutListRequestDTO } from '@/common/dto/list.dto';
import { SysRoleDocument } from '../role/schema/role.schema';
import { WalnutExceptionRefreshTokenExpired } from '@/exceptions/bussiness/auth';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { AppConstCacheKeys, AppConstSettingKeys } from '@/const/app/cache';

@Injectable()
export class SysUserService {
  constructor(
    @AppInjectModel(SysUserModel.name)
    private readonly sysUserModel: Model<SysUserDocument>,
    private readonly sysUserRepo: SysUserRepository,
    private readonly cacheService: AppCacheService,
  ) {}

  /**
   * @description set hashed refresh token into db
   */
  async setRefreshToken(refreshToken: string, userId: string) {
    const hashedRefreshToken = await hash(refreshToken, 10);
    return await this.sysUserModel.findByIdAndUpdate(userId, {
      hashedRefreshToken,
    });
  }

  /**
   * @description remove refresh token from db
   */
  async removeRefreshToken(userId: string) {
    return await this.sysUserModel.findByIdAndUpdate(userId, {
      hashedRefreshToken: '',
    });
  }

  /**
   * @description set hashed refresh token into db
   */
  async getIfRefreshTokenMatched(refreshToken: string, userId: string) {
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

    if (!user) {
      return {
        user: null,
        roleIds: null,
        roleNames: null,
      };
    }

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

  /**
   * @description get user role id list through condition
   */
  async getUserRoleIdsByCondition(condition: Partial<SysUserDto>) {
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

    return populatedUser.role.map((i) => i._id.toString());
  }

  /**
   * @description use userRepo to check user existence
   */
  async checkUserExistence(dto: Partial<SysUserDto>) {
    return await this.sysUserRepo.isExistByUniqueKey({
      userName: dto.userName,
      emailAddress: dto.emailAddress,
      phoneNumber: dto.phoneNumber,
    });
  }

  // base CRUD
  async create(dto: Partial<SysUserDto>) {
    const appSetting = await this.cacheService.get(
      AppConstCacheKeys.APP_SETTING,
    );

    const DEFAULT_PASSWORD = appSetting[AppConstSettingKeys.DEFAULT_PASSWORD];
    const DEFAULT_ROLE = appSetting[AppConstSettingKeys.DEFAULT_ROLE];

    return await this.sysUserRepo.create({
      ...dto,
      password: dto.password ?? DEFAULT_PASSWORD,
      role: dto.role ?? [DEFAULT_ROLE],
    });
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
    return await this.sysUserRepo.list(params);
  }
}
