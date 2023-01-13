import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from '@nestjs/common';

import { AppConstCacheKeys } from '@/const/app/cache';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { Reflector } from '@nestjs/core';
import { AppConstPublicMeta } from '@/const/decorator/public';

@Injectable()
export class FingerprintGuard implements CanActivate {
    private readonly logger = new Logger(FingerprintGuard.name);

    constructor(
        private readonly reflector: Reflector,
        private readonly cacheService: AppCacheService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<IWalnutRequest>();

        // public
        // just return true
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            AppConstPublicMeta.PUBLIC,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        // extract the socket pool from cache
        // filter the income fingerprint
        const currentUserPool = await this.cacheService.get<[string, string][]>(
            AppConstCacheKeys.SOCKET_POOL,
        );

        const incomeFingerprint = request.fingerprint

        if (!incomeFingerprint || !currentUserPool.map(i => i[0]).includes(incomeFingerprint)) {
            return false
        }

        return true;
    }
}
