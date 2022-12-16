import {
  ArrayUnique,
  IsEmail,
  IsMobilePhone,
  IsOptional,
} from 'class-validator';
import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import {
  BooleanFieldOptional,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/decorators/field';

export class SysUserDto extends WalnutAbstractDTO {
  @StringField({ minLength: 4, maxLength: 20 })
  readonly userName: string;

  @StringFieldOptional({ minLength: 4, maxLength: 20 })
  readonly nickName: string;

  @NumberFieldOptional({
    minimum: 0,
    maximum: 99,
    int: true,
  })
  readonly age: number;

  @StringFieldOptional()
  readonly gender: string;

  @StringFieldOptional({ minLength: 8 })
  readonly password: string;

  @StringFieldOptional()
  readonly avatar: string;

  @IsMobilePhone()
  @StringFieldOptional()
  readonly phoneNumber: string;

  @IsEmail()
  @StringFieldOptional()
  readonly emailAddress: string;

  @StringFieldOptional()
  readonly description: string;

  @BooleanFieldOptional()
  readonly status: boolean;

  @ArrayUnique()
  @IsOptional()
  readonly role: string[];
}
