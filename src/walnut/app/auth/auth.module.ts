import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserModule } from '../system/user/user.module';

import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './auth.controller';
import { JwtConfigService } from './configs/jwt.config';
import { MenuModule } from '../system/menu/menu.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: true }),

    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),

    UserModule,
    MenuModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
