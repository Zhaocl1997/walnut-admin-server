import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import {
  BooleanFieldOptional,
  EnumFieldOptional,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/decorators/field';
import { DictDataTagTypeEnum } from '../schema/dictData.schema';

export class SysDictDataDto extends WalnutAbstractDTO {
  @StringField()
  readonly typeId: string;

  @StringFieldOptional()
  readonly label: string;

  @StringFieldOptional()
  readonly value: string;

  @NumberFieldOptional({
    int: true,
  })
  readonly order: number;

  @BooleanFieldOptional()
  readonly status: boolean;

  @EnumFieldOptional(() => DictDataTagTypeEnum)
  readonly tagType: DictDataTagTypeEnum;

  @StringFieldOptional()
  readonly description: string;
}
