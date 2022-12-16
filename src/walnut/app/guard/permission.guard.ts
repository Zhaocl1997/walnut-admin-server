import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { WalnutExceptionAccessDenied } from '../exceptions/bussiness/auth';
import {
  AppConstPermissionMeta,
  AppConstPermissionMode,
  AppConstPermissionModeType,
} from '../const/decorator/permissions';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { AppPermissionService } from '@/modules/shared/permission/permission.service';
import { AppConstHeaders } from '@/const/app/header';

@Injectable()
export class PermissionGuard implements CanActivate {
  private readonly logger = new Logger(PermissionGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: AppCacheService,
    @Inject(AppPermissionService)
    private readonly permissionService: AppPermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<IWalnutRequest>();

    const payloadPermission = this.reflector.getAllAndOverride<
      string | string[]
    >(AppConstPermissionMeta.PERMISSION, [
      context.getHandler(),
      context.getClass(),
    ]);

    const payloadPermissionMode =
      this.reflector.getAllAndOverride<AppConstPermissionModeType>(
        AppConstPermissionMeta.PERMISSION_MODE,
        [context.getHandler(), context.getClass()],
      );

    if (!payloadPermission) {
      this.logger.debug(
        'Your are not providing any permission(s) for access controll when using permission decorator!',
        'Please provide at least 1 permission string for this decorator.',
      );
      return true;
    }

    const user = request.user;

    // by default, we assume that when using this guard, user must have beed logged in
    // if we do not find user on request, just simply return false
    if (!user) return false;

    // get permissions from cache
    let allPermissions = await this.cacheService.get<string[]>(
      `P_${user.userId}`,
    );

    // if we do not find permission strings in cache
    // just fetch from db again and set it to allPermissions
    if (!allPermissions) {
      const res: string[] = await this.permissionService.getPermissionStrings(
        user.roleIds,
      );

      allPermissions = res;

      // set permissions into cache
      this.cacheService.set(`P_${user.userId}`, allPermissions, {
        ttl: user.exp - user.iat,
        start: user.iat * 1000,
        t: 'auth-permissions'
      });
    }

    // define the flag, default true
    let canNext = true;

    // handle permission strings
    if (Array.isArray(payloadPermission)) {
      // and mode, use `every` to judge
      if (payloadPermissionMode === AppConstPermissionMode.AND) {
        canNext = payloadPermission.every((i) => allPermissions.includes(i));
      }

      // or mode, use `some` to judge
      if (payloadPermissionMode === AppConstPermissionMode.OR) {
        canNext = allPermissions.some((i) => payloadPermission.includes(i));
      }
    }

    // only one string, just use `includes` to judge
    if (typeof payloadPermission === 'string') {
      canNext = allPermissions.includes(payloadPermission);

      // TODO more flexable
      // this request has scoped permission header
      // make next true for this request
      if (request.headers[AppConstHeaders.PERMISSION] === payloadPermission) {
        canNext = true;
      }
    }

    // can not go ahead, throw custom permission error
    if (!canNext) {
      throw new WalnutExceptionAccessDenied();
    }

    return true;
  }
}
