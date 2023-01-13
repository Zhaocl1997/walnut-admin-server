import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
} from '@nestjs/common';

import { AppConstCacheKeys } from '@/const/app/cache';
import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';

@Injectable()
export class FingerprintGuard implements CanActivate {
    private readonly logger = new Logger(FingerprintGuard.name);

    constructor(
        private readonly cacheService: AppCacheService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<IWalnutRequest>();

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
