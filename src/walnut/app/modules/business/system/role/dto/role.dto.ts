import { ArrayUnique, IsOptional } from 'class-validator';
import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import {
  BooleanFieldOptional,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/decorators/field';

export class SysRoleDto extends WalnutAbstractDTO {
  @StringField({ minLength: 1, maxLength: 20 })
  readonly roleName: string;

  @StringFieldOptional({ minLength: 1, maxLength: 100 })
  readonly description: string;

  @NumberFieldOptional({
    int: true,
  })
  readonly order: number;

  @ArrayUnique()
  @IsOptional()
  readonly menus: string[];

  @BooleanFieldOptional()
  readonly status: boolean;
}
