import { StringField } from '../../../decorators/field';

export class AppTokenEntity {
  constructor(partial: Partial<AppTokenEntity>) {
    Object.assign(this, partial);
  }

  @StringField()
  accessToken: string;

  @StringField()
  refreshToken: string;
}

export class RefreshEntity {
  constructor(partial: Partial<RefreshEntity>) {
    Object.assign(this, partial);
  }

  @StringField()
  accessToken: string;
}
