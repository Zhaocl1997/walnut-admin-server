import { EnumField, EnumFieldOptional } from '@/decorators/field';

export enum SysLocalePoolEnum {
  zh_CN = 'zh-CN',
  en_US = 'en-US',
}

export class SysLocaleMessageDTO {
  // TODO use EnumField not working
  @EnumFieldOptional(() => SysLocalePoolEnum, {
    default: SysLocalePoolEnum.en_US,
  })
  locale: SysLocalePoolEnum;
}
