import { SysUserDto } from '@/modules/business/system/user/dto/user.dto';
import { PickType } from '@nestjs/swagger';

import { StringField } from '../../../decorators/field';

export class AuthWithPwdDTO extends PickType(SysUserDto, [
  'userName',
  'password',
]) {}

export class RefreshDTO {
  @StringField()
  refreshToken: string;
}

export class SendAuthEmailDTO extends PickType(SysUserDto, ['emailAddress']) {}

export class AuthWithEmailDTO extends PickType(SysUserDto, ['emailAddress']) {}

export class SendAuthTextMessageDTO extends PickType(SysUserDto, [
  'phoneNumber',
]) {}

export class AuthWithPhoneDTO extends PickType(SysUserDto, ['phoneNumber']) {}
