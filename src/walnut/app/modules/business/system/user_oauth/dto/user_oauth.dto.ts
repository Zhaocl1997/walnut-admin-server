import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import { BooleanFieldOptional, StringFieldOptional } from '@/decorators/field';

export class SysUserOauthDto extends WalnutAbstractDTO {
  @StringFieldOptional()
  readonly userId: string;

  @StringFieldOptional()
  readonly provider: string;

  @StringFieldOptional()
  readonly providerId: string;

  @BooleanFieldOptional()
  readonly status: boolean;
}
