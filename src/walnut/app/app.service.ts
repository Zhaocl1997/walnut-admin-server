import { Injectable } from '@nestjs/common';
import { ResponseSuccess } from './shared/response';
@Injectable()
export class AppService {
  getHello() {
    return ResponseSuccess({
      text: 'Hello World!',
    });
  }
}
