import { SchemaFactory } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';
import { WalnutAbstractModel } from '../model/base.model';

export const createWalnutSchema = <T extends WalnutAbstractModel>(
  model: Type<T>,
) => {
  const schema = SchemaFactory.createForClass(model);

  // aggragate hook
  schema.pre('aggregate', function () {
    this.pipeline().unshift({ $match: { deleted: false } });
  });

  // find hook
  schema.pre('find', function () {
    this.where({ deleted: false });
  });

  // update hook
  schema.pre('update', function () {
    this.where({ deleted: false });
  });

  // updateMany hook
  schema.pre('updateMany', function () {
    this.where({ deleted: false });
  });

  // findOneAndUpdate hook
  schema.pre('findOneAndUpdate', function () {
    this.where({ deleted: false });
  });

  return schema;
};
