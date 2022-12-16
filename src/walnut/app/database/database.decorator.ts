import { AppConstDatabaseConnectionName } from '@/const/db/connectionName';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

export const AppInjectModel = (name: string) => {
  return InjectModel(name, AppConstDatabaseConnectionName.PRIMARY);
};

export const AppInjectConnection = (connectionName?: string) => {
  return InjectConnection(
    connectionName ?? AppConstDatabaseConnectionName.PRIMARY,
  );
};
