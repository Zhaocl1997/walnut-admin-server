import { AppConstAuthStrategy } from '@/const/app/strategy';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OauthGitHubGuard extends AuthGuard(
  AppConstAuthStrategy.THIRD_PARTY_GITHUB,
) {}
