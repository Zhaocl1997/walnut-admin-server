import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import {
  BooleanFieldOptional,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/decorators/field';

export class SysLangDto extends WalnutAbstractDTO {
  @StringField({ minLength: 1, maxLength: 20 })
  readonly lang: string;

  @StringFieldOptional({ minLength: 1, maxLength: 100 })
  readonly description: string;

  @NumberFieldOptional({
    int: true,
  })
  readonly order: number;

  @BooleanFieldOptional()
  readonly status: boolean;
}
