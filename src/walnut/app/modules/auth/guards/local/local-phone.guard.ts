import { AppConstAuthStrategy } from '@/const/app/strategy';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalPhoneGuard extends AuthGuard(
  AppConstAuthStrategy.JWT_LOCAL_PHONE,
) {}
