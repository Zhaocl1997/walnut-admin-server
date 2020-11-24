import { Exclude } from 'class-transformer';

export class UserEntity {
  username: string;
  nickName: string;

  @Exclude()
  password: string;

  @Exclude()
  salt: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
