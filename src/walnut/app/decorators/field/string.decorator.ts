import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ToLowerCase, ToUpperCase, Trim } from '../transform.decorator';

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  // const decorators = [IsNotEmpty(), IsString(), Trim()];
  const decorators = [IsString(), Trim()];

  if (options?.swagger !== false) {    
    decorators.push(ApiProperty({ type: String, ...options }));
  }

  if (options?.minLength) {
    decorators.push(MinLength(options.minLength));
  }

  if (options?.maxLength) {
    decorators.push(MaxLength(options.maxLength));
  }

  if (options?.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options?.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  return applyDecorators(...decorators);
}

export function StringFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IStringFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    StringField({ required: false, ...options }),
  );
}
