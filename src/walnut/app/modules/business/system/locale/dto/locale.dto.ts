import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import { StringField, StringFieldOptional } from '@/decorators/field';

export class SysLocaleDto extends WalnutAbstractDTO {
  @StringFieldOptional()
  readonly langId: string;

  @StringField()
  readonly key: string;

  @StringFieldOptional()
  readonly value: string;
}
