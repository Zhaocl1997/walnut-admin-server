import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  readonly username: string;

  readonly nickName: string;

  readonly age: number;

  readonly sex: string;

  readonly password: string;

  readonly avatar: string;
}
