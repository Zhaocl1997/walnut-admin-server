import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UserService } from '../system/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user) {
      const isPassValid = await bcrypt.compare(pass, user.password);

      if (isPassValid) {
        const { password, ...result } = user;
        return result;
      } else {
        throw new BadRequestException('pass is not valid');
      }
    } else {
      throw new BadRequestException('user is not found');
    }
  }

  async signin(payload: any) {
    const sign = {
      username: payload.username,
      userId: payload._id,
      role: payload.role,
    };
    return {
      token: this.jwtService.sign(sign),
    };
  }
}
