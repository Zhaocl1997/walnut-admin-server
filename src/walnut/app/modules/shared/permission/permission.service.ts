import { Injectable } from '@nestjs/common';
import { SysMenuService } from '../../business/system/menu/menu.service';

@Injectable()
export class AppPermissionService {
  constructor(private readonly menuService: SysMenuService) {}

  /**
   * @description get current user authorized menus
   */
  async getPermissionMenus(roleIds: string[]) {
    return await this.menuService.getPermissionMenus(roleIds);
  }

  /**
   * @description get current user permissions
   */
  async getPermissionStrings(roleIds: string[]) {
    const menus = await this.getPermissionMenus(roleIds);

    return menus.map((i) => i.permission).filter(Boolean);
  }
}
