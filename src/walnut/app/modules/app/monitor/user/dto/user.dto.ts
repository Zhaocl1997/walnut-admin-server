import { WalnutAbstractDTO } from '@/common/dto/base.dto';

import { BooleanFieldOptional, StringFieldOptional } from '@/decorators/field';

export class AppMonitorUserDTO extends WalnutAbstractDTO {
  @StringFieldOptional()
  readonly visitorId: string;

  @StringFieldOptional()
  readonly userId: string;

  @StringFieldOptional()
  readonly userName: string;

  @StringFieldOptional()
  readonly ip: string;

  @StringFieldOptional()
  readonly location: string;

  @StringFieldOptional()
  readonly os: string;

  @StringFieldOptional()
  readonly browser: string;

  @BooleanFieldOptional()
  readonly auth: boolean;

  @BooleanFieldOptional()
  readonly focus: boolean;

  @BooleanFieldOptional()
  readonly left: boolean;

  @StringFieldOptional()
  readonly currentRouter: string;

  @StringFieldOptional()
  readonly authTime: string;
}
