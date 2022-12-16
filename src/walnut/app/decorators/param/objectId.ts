import { Param } from '@nestjs/common';
import {
  WalnutParseMongoIdPipe,
  WalnutParseMongoIdsPipe,
} from '../../pipes/mongoId.pipe';

export const WalnutIdParamDecorator = () => {
  return Param('id', new WalnutParseMongoIdPipe());
};

export const WalnutIdsParamDecorator = () => {
  return Param('ids', new WalnutParseMongoIdsPipe());
};
