import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nOptionsFactory, I18nOptionsWithoutResolvers } from 'nestjs-i18n';
import { join } from 'path';

@Injectable()
export class I18nConfigService implements I18nOptionsFactory {
  private readonly logger = new Logger('ConfigService - I18n');

  constructor(private readonly configService: ConfigService) {}

  createI18nOptions(): I18nOptionsWithoutResolvers {
    this.logger.debug('Initiating i18n module...');

    return {
      fallbackLanguage: this.configService.get('app.i18n.fallback'),
      loaderOptions: {
        path: join(__dirname, '../i18n/'),
        watch: true,
      },
    };
  }
}
