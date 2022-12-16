import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseEncryption } from '../../utils/vendor/crypto';

@Injectable()
export class WalnutEncryptResponseInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<string>> {
    const key = this.configService.get('crypto.response.key');
    const iv = this.configService.get('crypto.response.iv');

    return next.handle().pipe(
      map((data) => {
        return ResponseEncryption.encrypt(data, key, iv);
      }),
    );
  }
}
