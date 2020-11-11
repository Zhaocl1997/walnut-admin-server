import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly age: number;

  @IsNotEmpty()
  readonly sex: string;

  @IsNotEmpty()
  readonly password: string;
}
