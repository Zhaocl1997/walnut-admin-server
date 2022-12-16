import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { AppConstProcess } from '@/const/app/process';
import { AppConstQueue } from '@/const/app/queue';

@Injectable()
export class AppMailerService {
  constructor(
    @InjectQueue(AppConstQueue.EMAIL) private readonly emailQueue: Queue,
  ) {}

  // send welcome email
  async sendWelcome(toEmail: string | string[], lang: string) {
    if (!toEmail) return;
    
    // push to queue
    await this.emailQueue.add(
      AppConstProcess.EMAIL_WELCOME,
      {
        toEmail,
        lang,
      },
      { removeOnComplete: true, removeOnFail: true },
    );
  }

  // send verify code email
  async sendVerifyCodeEmail(
    toEmail: string,
    verifyCode: number,
    expireSeconds: number,
    lang: string,
  ) {
    // push to queue
    await this.emailQueue.add(
      AppConstProcess.EMAIL_VERIFY,
      {
        toEmail,
        verifyCode,
        expireSeconds,
        lang,
      },
      { removeOnComplete: true, removeOnFail: true },
    );
  }
}
