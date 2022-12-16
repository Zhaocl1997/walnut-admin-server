import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import { AppConstLogAuthType, AppConstLogAuthTypeType } from '@/const/decorator/logAuth';
import {
  BooleanFieldOptional,
  EnumField,
  StringFieldOptional,
} from '@/decorators/field';

export class SysLogAuthDTO extends WalnutAbstractDTO {
  @StringFieldOptional()
  readonly ip: string;

  @StringFieldOptional()
  readonly location: string;

  @StringFieldOptional()
  readonly os: string;

  @StringFieldOptional()
  readonly browser: string;

  @StringFieldOptional()
  readonly userId: string;

  @StringFieldOptional()
  readonly userName: string;

  @BooleanFieldOptional()
  readonly success: boolean;

  @StringFieldOptional()
  readonly msg: string;

  @EnumField(() => AppConstLogAuthType)
  readonly type: AppConstLogAuthTypeType
}
