import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  AppConstRoleMeta,
  AppConstRoleMode,
  AppConstRoleModeType,
} from '@/const/decorator/role';
import { WalnutExceptionAccessDenied } from '@/exceptions/bussiness/auth';
import { SysUserService } from '@/modules/business/system/user/user.service';
import { AppCacheRolesService } from '@/modules/app/monitor/cache/services/cache.roles';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: AppCacheRolesService,
    // TODO make it not global
    @Inject(SysUserService) private readonly userService: SysUserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<IWalnutRequest>();

    const payloadRole = this.reflector.getAllAndOverride<string | string[]>(
      AppConstRoleMeta.ROLE,
      [context.getHandler(), context.getClass()],
    );

    const payloadRoleMode =
      this.reflector.getAllAndOverride<AppConstRoleModeType>(
        AppConstRoleMeta.ROLE_MODE,
        [context.getHandler(), context.getClass()],
      );

    if (!payloadRole) {
      this.logger.debug(
        'Your are not providing any role(s) for access controll when using role decorator!',
        'Please provide at least 1 role string for this decorator.',
      );
      return true;
    }

    const user = request.user;

    // by default, we assume that when using this guard, user must have beed logged in
    // if we do not find user on request, just simply return false
    if (!user) return false;

    // get role names from cache
    let allRoleNames = await this.cacheService.getRoles(user.userId);

    // if we do not find role names in cache
    // just fetch from db again and set it to allRoleNames
    if (!allRoleNames) {
      const res = await this.userService.getUserRoleNamesByCondition({
        userName: user.userName,
      });

      allRoleNames = res;

      // set roleNames into cache
      this.cacheService.setRoles(user, allRoleNames);
    }

    // define the flag, default true
    let canNext = true;

    // handle role strings
    if (Array.isArray(payloadRole)) {
      // and mode, use `every` to judge
      if (payloadRoleMode === AppConstRoleMode.AND) {
        canNext = payloadRole.every((i) => allRoleNames.includes(i));
      }

      // or mode, use `some` to judge
      if (payloadRoleMode === AppConstRoleMode.OR) {
        canNext = allRoleNames.some((i) => payloadRole.includes(i));
      }
    }

    // only one string, just use `includes` to judge
    if (typeof payloadRole === 'string') {
      canNext = allRoleNames.includes(payloadRole);
    }

    // can not go ahead, throw custom permission error
    if (!canNext) {
      throw new WalnutExceptionAccessDenied();
    }

    return canNext;
  }
}
