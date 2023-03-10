import { StringField } from '@/decorators/field';
import { IsMongoId } from 'class-validator';

export class ResetPasswordDto {
  @StringField()
  @IsMongoId()
  readonly userId: string;
}

export class UpdatePasswordDto {
  @StringField()
  @IsMongoId()
  readonly userId: string;

  @StringField()
  readonly newPassword: string;
}
