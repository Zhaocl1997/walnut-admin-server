import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export function DateField(
  options: Omit<ApiPropertyOptions, 'type'> & Partial<{ swagger: false }> = {},
): PropertyDecorator {
  const decorators = [Type(() => Date), IsDate()];

  if (options?.swagger !== false) {
    decorators.push(ApiProperty(options));
  }

  return applyDecorators(...decorators);
}

export function DateFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    Partial<{ swagger: false }> = {},
): PropertyDecorator {
  return applyDecorators(
    IsOptional(),
    DateField({ ...options, required: false }),
  );
}
