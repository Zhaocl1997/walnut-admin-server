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
  readonly country: string;

  @StringFieldOptional()
  readonly province: string;

  @StringFieldOptional()
  readonly city: string;

  @StringFieldOptional()
  readonly area: string;

  @StringFieldOptional()
  readonly isp: string;

  @StringFieldOptional()
  readonly userAgent: string;

  @StringFieldOptional()
  readonly netType: string;

  @StringFieldOptional()
  readonly platform: string;

  @StringFieldOptional()
  readonly os: string;

  @StringFieldOptional()
  readonly browser: string;

  @StringFieldOptional()
  readonly vp: string;

  @StringFieldOptional()
  readonly sr: string;

  @StringFieldOptional()
  readonly device: string;

  @StringFieldOptional()
  readonly engine: string;

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
