import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { AppConstQueue } from '@/const/app/queue';
import { AppConstProcess } from '@/const/app/process';

@Injectable()
export class AppSmsService {
  constructor(
    @InjectQueue(AppConstQueue.PHONE) private readonly emailQueue: Queue,
  ) {}

  async sendVerifyCodeTextMessage(
    phoneNumber: string,
    verifyCode: number,
    expireSeconds: number,
    lang: string,
  ) {
    if (!phoneNumber) return;

    // push to queue
    await this.emailQueue.add(
      AppConstProcess.PHONE_VERIFY,
      {
        phoneNumber,
        verifyCode,
        expireSeconds,
        lang,
      },
      { removeOnComplete: true, removeOnFail: true },
    );
  }
}
