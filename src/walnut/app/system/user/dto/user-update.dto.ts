import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  readonly id: string;

  readonly name: string;

  readonly age: number;

  readonly sex: string;
}
