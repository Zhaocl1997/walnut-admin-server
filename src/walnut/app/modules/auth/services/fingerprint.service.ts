import { AppCacheService } from '@/modules/app/monitor/cache/cache.service';
import { Injectable } from '@nestjs/common';
import { merge } from 'lodash';

@Injectable()
export class AuthFingerprintService {
  constructor(private readonly cacheService: AppCacheService) {}

  private initFpState() {
    return {
      auth: { github: false, gitee: false, weibo: false },
      tokens: { accessToken: undefined, refreshToken: undefined },
    };
  }

  async getFPInfo<T>(fpId: string) {
    const res = await this.cacheService.get<T>(`FP_${fpId}`);
    if (!res) return this.initFpState();
    return res;
  }

  // set fp id into cache
  async setFPID(fpId: string, merged: FingerPrintInfo = this.initFpState()) {
    await this.cacheService.set(
      `FP_${fpId}`,
      merge(this.initFpState(), merged),
      {
        t: 'fingerprint',
        ttl: 60,
      },
    );
  }

  // clean fingerprint info
  async delFPID(fpId: string) {
    await this.setFPID(fpId);
  }
}
