import { SchemaFactory } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';
import { WalnutAbstractModel } from '../model/base.model';

export const createWalnutSchema = <T extends WalnutAbstractModel>(
  model: Type<T>,
) => {
  const schema = SchemaFactory.createForClass(model);

  // aggragate hook
  schema.pre('aggregate', function () {
    console.log(model.name, 'aggregate');

    this.pipeline().unshift({ $match: { deleted: false } });
  });

  // find hook
  schema.pre('find', function () {
    console.log(model.name, 'find');

    this.where({ deleted: false });
  });

  // update hook
  schema.pre('update', function () {
    console.log(model.name, 'update');

    this.where({ deleted: false });
  });

  // updateMany hook
  schema.pre('updateMany', function () {
    console.log(model.name, 'updateMany');

    this.where({ deleted: false });
  });

  // findOneAndUpdate hook
  schema.pre('findOneAndUpdate', function () {
    console.log(model.name, 'findOneAndUpdate');

    this.where({ deleted: false });
  });

  return schema;
};
