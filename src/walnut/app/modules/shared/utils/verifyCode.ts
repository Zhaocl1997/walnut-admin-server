import { Injectable, Logger } from '@nestjs/common';
import { random } from 'lodash';

@Injectable()
export class UtilServiceVeriyCode {
  private readonly logger = new Logger(UtilServiceVeriyCode.name);

  // generate verify code
  generateVerifyCode(length = 6) {
    const start = parseInt(
      `1${Array.from({ length: length - 1 })
        .fill('0')
        .join('')}`,
    );

    const end = parseInt(`${Array.from({ length }).fill('9').join('')}`);

    const code = random(start, end, false);

    this.logger.debug(`Generated code: ${code}`);

    return code;
  }
}
