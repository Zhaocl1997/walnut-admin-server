import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import {
  BooleanFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/decorators/field';

export class SysDictTypeDto extends WalnutAbstractDTO {
  @StringField()
  readonly name: string;

  @StringFieldOptional()
  readonly type: string;

  @StringFieldOptional()
  readonly description: string;

  @BooleanFieldOptional()
  readonly status: boolean;
}
