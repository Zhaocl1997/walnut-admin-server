import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import { AppConstSettingTypeType } from '@/const/app/setting';
import { StringField, StringFieldOptional } from '@/decorators/field';

export class AppSettingDto extends WalnutAbstractDTO {
  @StringField()
  readonly settingName: string;

  @StringField()
  readonly settingKey: string;

  @StringField()
  readonly settingValue: string;

  @StringField()
  readonly settingType: AppConstSettingTypeType

  @StringFieldOptional()
  readonly remark: string;

  @StringFieldOptional()
  readonly createdBy: string;
}
