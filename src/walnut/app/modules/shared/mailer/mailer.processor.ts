import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { I18nService } from 'nestjs-i18n';

import { AppConstProcess } from '@/const/app/process';
import { AppConstQueue } from '@/const/app/queue';
import { WalnutExceptionSendEmailError } from '@/exceptions/bussiness/email';
import { AppBaseProcessor } from '@/common/processor/base.processor';

@Processor(AppConstQueue.EMAIL)
export class AppMailerProcessor extends AppBaseProcessor {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly i18nService: I18nService,
  ) {
    super();
  }

  // send welcome email
  @Process(AppConstProcess.EMAIL_WELCOME)
  async JobSendWelcomeEmail(job: Job<any>) {
    const { toEmail, lang } = job.data;

    try {
      await this.mailerService.sendMail({
        to: toEmail,
        subject: await this.i18nService.t('email.welcome.subject', { lang }),
        template: 'welcome',
        context: {
          title: await this.i18nService.t('email.welcome.title', { lang }),
          desc1: await this.i18nService.t('email.welcome.desc1', { lang }),
          desc2: await this.i18nService.t('email.welcome.desc2', { lang }),
          here: await this.i18nService.t('email.welcome.here', { lang }),
          lang: lang,
        },
      });
    } catch {
      return false;
    }

    return true;
  }

  // send verify code email
  @Process(AppConstProcess.EMAIL_VERIFY)
  async JobSendVerifyCodeEmail(job: Job<any>) {
    const { toEmail, verifyCode, expireSeconds, lang } = job.data;

    try {
      const res = await this.mailerService.sendMail({
        to: toEmail,
        subject: await this.i18nService.t('email.verify.subject', { lang }),
        template: 'verify',
        context: {
          title: await this.i18nService.t('email.verify.title', { lang }),
          desc1: await this.i18nService.t('email.verify.desc1', { lang }),
          desc2: await this.i18nService.t('email.verify.desc2', { lang }),
          desc3: await this.i18nService.t('email.verify.desc3', {
            lang,
            args: { min: Math.floor(expireSeconds / 60) },
          }),
          verifyCode,
          lang,
        },
      });

      this.logger.debug(res);
    } catch {
      throw new WalnutExceptionSendEmailError();
    }

    return true;
  }
}
