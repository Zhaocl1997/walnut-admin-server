import { objectIdExample1 } from '@/const/app/objectId';
import { IsMongoId } from 'class-validator';
import {
  BooleanFieldOptional,
  DateFieldOptional,
  StringFieldOptional,
} from '../../decorators/field';

// HINT
// Since TypeScript does not store metadata about generics or interfaces,
// when you use them in your DTOs,
// ValidationPipe may not be able to properly validate incoming data.
// For this reason, consider using concrete classes in your DTOs.
// HINT
// When importing your DTOs,
// you can't use a type-only import as that would be erased at runtime,
// i.e. remember to import { CreateUserDto }
// instead of  import type { CreateUserDto }

export abstract class WalnutAbstractDTO {
  @StringFieldOptional({ example: objectIdExample1 })
  @IsMongoId()
  _id?: string;

  @DateFieldOptional({ example: '2022-05-26 00:00:00' })
  createdAt?: Date;

  @DateFieldOptional({ example: '2022-05-26 00:00:00' })
  updatedAt?: Date;

  @BooleanFieldOptional({
    example: false,
    readOnly: true,
    deprecated: true,
    default: false,
  })
  deleted?: boolean;
}
