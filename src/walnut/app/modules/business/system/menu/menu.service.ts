import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { AppInjectModel } from '@/database/database.decorator';

import { SysMenuModel, SysMenuDocument } from './schema/menu.schema';
import { SysRoleService } from '../role/role.service';
import { SysMenuRepository } from './menu.repository';
import { SysLocaleService } from '../locale/locale.service';
import { SysMenuDto } from './dto/menu.dto';
import {
  WalnutListRequestDTO,
  WalnutListResponseDTO,
} from '@/common/dto/list.dto';
import { AppConstRoles } from '@/const/role';
import { SysMenuEntity } from './entities/menu.entity';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';

@Injectable()
export class SysMenuService {
  constructor(
    @AppInjectModel(SysMenuModel.name)
    private readonly menuModel: Model<SysMenuDocument>,
    private readonly roleService: SysRoleService,
    private readonly localeService: SysLocaleService,
    private readonly menuRepo: SysMenuRepository,
    private readonly cacheService: AppCacheService,
  ) {}

  /**
   * @description Since roleIds is written in token, so if admin changed some user's role,
   * this user need to signout and re-signin to gain new permitted menus
   */
  async getPermissionMenus(roleIds: string[]) {
    const rootMenu = await this.menuModel.findOne({ pid: undefined });

    const promises = roleIds.map(
      async (roleId) =>
        await (
          await this.roleService.findById(roleId)
        ).populate({ path: 'menus', match: { deleted: false, status: true } }),
    );

    const roles = await Promise.all(promises);

    // admin has all permission menus, just find and return
    if (roles.some((role) => role.roleName === AppConstRoles.ADMIN)) {
      const allMenus = await this.menuModel
        .find({
          deleted: false,
          status: true,
        })
        .lean();

      return allMenus.map((i) => new SysMenuEntity(i));
    } else {
      const allMenus = [rootMenu].concat(
        // @ts-ignore
        ...Array.from(new Set(roles.map((i) => i.menus))),
      );

      return allMenus.map((i) => new SysMenuEntity(i.toObject()));
    }
  }

  // used for front end icon offline bundle
  async getIcons(): Promise<WalnutListResponseDTO<string>> {
    const icon = await this.menuModel.find({ deleted: false });
    const ret = [...new Set(icon.map((item) => item.icon).filter((i) => i))];

    return {
      data: ret,
      total: ret.length,
    };
  }

  // base CRUD
  async create(dto: SysMenuDto) {
    // remove all cache auth data when menu changed
    await this.cacheService.delAllAuthCache();

    return await this.menuRepo.create(dto);
  }

  async read(id: string) {
    return await this.menuRepo.readById(id);
  }

  async update(dto: SysMenuDto) {
    // remove all cache auth data when menu changed
    await this.cacheService.delAllAuthCache();

    return await this.menuRepo.update(dto);
  }

  async delete(id: string) {
    const deletedMenu = await this.menuRepo.delete(id);

    // delete all locales with deleted menu title
    await this.localeService.deleteByKey(deletedMenu.title);
    
    // remove all cache auth data when menu changed
    await this.cacheService.delAllAuthCache();

    return deletedMenu;
  }

  async findAll(params: WalnutListRequestDTO<SysMenuDto>) {
    return await this.menuRepo.list(params);
  }
}
