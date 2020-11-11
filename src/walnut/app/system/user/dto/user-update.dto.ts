import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  readonly id: string;

  readonly username: string;

  readonly age: number;

  readonly sex: string;

  readonly password: string;
}
