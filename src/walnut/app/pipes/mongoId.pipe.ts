import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { Types } from 'mongoose';
import { WalnutExceptionBadId } from '../exceptions/bussiness/data';

@Injectable()
export class WalnutParseMongoIdPipe
  implements PipeTransform<any, Types.ObjectId>
{
  transform(value: any, metadata: ArgumentMetadata) {
    if (!Types.ObjectId.isValid(value)) {
      throw new WalnutExceptionBadId();
    }

    return value;
  }
}

@Injectable()
export class WalnutParseMongoIdsPipe
  implements PipeTransform<any, Types.ObjectId>
{
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.includes(',')) {
      if (!Types.ObjectId.isValid(value)) {
        throw new WalnutExceptionBadId();
      }

      return value;
    } else {
      const ids = value.split(',');

      ids.map((id) => {
        if (!Types.ObjectId.isValid(id)) {
          throw new WalnutExceptionBadId();
        }
      });

      return value;
    }
  }
}
