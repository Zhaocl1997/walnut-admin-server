import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}

  getVariables(str) {
    return this.configService.get<string>(str);
  }

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.getVariables('jwt.serect'),
      signOptions: {
        expiresIn: this.getVariables('jwt.expire'),
      },
    };
  }
}
