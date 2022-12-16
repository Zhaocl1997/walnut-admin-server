import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  EnumFieldOptional,
  NumberField,
  NumberFieldOptional,
  StringFieldOptional,
} from '../../decorators/field';

export enum WalnutListRequestOrderEnum {
  ASCEND = 'ascend',

  DESCEND = 'descend',
}

export class WalnutListRequestDTOSort {
  @StringFieldOptional()
  readonly field: string;

  @EnumFieldOptional(() => WalnutListRequestOrderEnum)
  readonly order: WalnutListRequestOrderEnum | false;

  @NumberFieldOptional({ int: true })
  readonly priority: number;
}

export class WalnutListRequestDTOPage {
  @NumberFieldOptional({ int: true, minimum: 1 })
  readonly page: number;

  @NumberFieldOptional({ int: true, minimum: 1, maximum: 50 })
  readonly pageSize: number;
}

export class WalnutListRequestDTO<T> {
  @ApiPropertyOptional({
    example: {
      field1: 'this is a string',
      field2: false,
      field3: 123,
    },
  })
  @IsOptional()
  readonly query: T;

  @ApiPropertyOptional({
    type: () => [WalnutListRequestDTOSort],
    example: [
      {
        field: 'field1',
        order: 'ascend',
        priority: 1,
      },
      {
        field: 'field2',
        order: 'descend',
        priority: 2,
      },
      {
        field: 'field3',
        order: false,
        priority: 3,
      },
    ],
  })
  @IsOptional()
  readonly sort: WalnutListRequestDTOSort[];

  @ApiPropertyOptional({
    type: () => WalnutListRequestDTOPage,
    example: {
      page: 1,
      pageSize: 10,
    },
  })
  @IsOptional()
  readonly page: WalnutListRequestDTOPage;
}

export class WalnutListResponseDTO<T> {
  @ApiPropertyOptional({ isArray: true })
  data: T[];

  @NumberField({ minimum: 0, int: true })
  total: number;
}
