import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import {
  AppConstLogOperateAction,
  AppConstLogOperateActionType,
} from '@/const/decorator/logOperate';
import {
  BooleanFieldOptional,
  EnumField,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/decorators/field';

export class SysLogOperateDTO extends WalnutAbstractDTO {
  @StringField()
  readonly title: string;

  @EnumField(() => AppConstLogOperateAction)
  readonly actionType: AppConstLogOperateActionType;

  @StringFieldOptional()
  readonly method: string;

  @StringFieldOptional()
  readonly url: string;

  @StringFieldOptional()
  readonly httpVersion: string;

  @StringFieldOptional()
  readonly location: string;

  @StringFieldOptional()
  readonly os: string;

  @StringFieldOptional()
  readonly browser: string;

  @NumberFieldOptional({ int: true })
  readonly statusCode: number;

  @StringFieldOptional()
  readonly requestData: string;

  @StringFieldOptional()
  readonly responseData: string;

  @NumberFieldOptional({ int: true })
  readonly correspondingMS: number;

  @StringFieldOptional()
  readonly userId: string;

  @StringFieldOptional()
  readonly userName: string;

  @StringFieldOptional()
  readonly ip: string;

  @StringFieldOptional()
  readonly invokingMethod: string;

  @BooleanFieldOptional()
  readonly success: boolean;
}
