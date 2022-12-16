import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Injectable()
export class AppMailerConfigService implements MailerOptionsFactory {
  private readonly logger = new Logger('ConfigService - Mongoose');

  constructor(private readonly configService: ConfigService) {}

  createMailerOptions(): MailerOptions {
    this.logger.debug('Initiating mailer module...');

    return {
      transport: {
        host: this.configService.get('email.host'),
        port: this.configService.get('email.port'),
        secure: false,
        auth: {
          user: this.configService.get('email.auth.user'),
          pass: this.configService.get('email.auth.pass'),
        },
      },
      defaults: {
        from: {
          name: this.configService.get('email.defaults.from.name'),
          address: this.configService.get('email.defaults.from.address'),
        },
      },
      // preview: true,
      template: {
        dir: __dirname + '/template',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
