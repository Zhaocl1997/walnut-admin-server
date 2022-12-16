import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';

import { AppConstHeaders } from '@/const/app/header';
import { I18nConfigService } from './i18n.config.service';

@Module({
  imports: [
    I18nModule.forRootAsync({
      // TODO i18n do not support use class yet
      // useClass: I18nConfigService,

      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('app.i18n.fallback'),
        loaderOptions: {
          path: join(__dirname, '../i18n/'),
          watch: true,
        },
      }),

      resolvers: [
        new HeaderResolver([
          AppConstHeaders.LANGUAGE,
          AppConstHeaders.LANGUAGE.toLowerCase(),
        ]),
        new QueryResolver(['xl']),
        new AcceptLanguageResolver(),
      ],
      loader: I18nJsonLoader,
    }),
  ],
  providers: [],
  exports: [],
})
export class AppI18nModule {}
