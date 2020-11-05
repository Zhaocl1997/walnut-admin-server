import { IsNotEmpty } from 'class-validator';

export class ReadUserDto {
  @IsNotEmpty()
  readonly id: string;
}
