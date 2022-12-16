import { WalnutAbstractDTO } from '@/common/dto/base.dto';
import {
  BooleanFieldOptional,
  EnumField,
  EnumFieldOptional,
  NumberFieldOptional,
  StringField,
  StringFieldOptional,
} from '@/decorators/field';
import { SysMenuTernalEnum, SysMenuTypeEnum } from '../schema/menu.schema';

export class SysMenuDto extends WalnutAbstractDTO {
  @StringField()
  readonly pid: string;

  @EnumField(() => SysMenuTypeEnum)
  readonly type: SysMenuTypeEnum;

  @StringFieldOptional()
  readonly path: string;

  @StringFieldOptional()
  readonly name: string;

  @StringFieldOptional()
  readonly component: string;

  @StringFieldOptional()
  readonly title: string;

  @StringFieldOptional()
  readonly icon: string;

  @NumberFieldOptional({
    int: true,
  })
  readonly order: number;

  @EnumFieldOptional(() => SysMenuTernalEnum)
  readonly ternal: SysMenuTernalEnum;

  @StringFieldOptional()
  readonly url: string;

  @BooleanFieldOptional()
  readonly show: boolean;

  @BooleanFieldOptional()
  readonly cache: boolean;

  @BooleanFieldOptional()
  readonly status: boolean;

  @BooleanFieldOptional()
  readonly affix: boolean;

  @StringFieldOptional()
  readonly permission: string;

  @StringFieldOptional()
  readonly menuActiveName: string;

  @BooleanFieldOptional()
  readonly menuActiveSameTab: boolean;

  @StringFieldOptional()
  readonly badge: string;

  @StringFieldOptional()
  readonly animationName: string;

  @StringFieldOptional()
  readonly activeIcon: string;

  @BooleanFieldOptional()
  readonly position: boolean;

  @BooleanFieldOptional()
  readonly leaveTip: boolean;
}
