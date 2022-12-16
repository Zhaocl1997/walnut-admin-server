import {
  AppConstLogOperateAction,
  AppConstLogOperateTitleType,
} from '../../const/decorator/logOperate';
import { WalnutCreateDecorator } from './create';
import { WalnutReadDecorator } from './read';
import { WalnutUpdateDecorator } from './update';
import { WalnutDeleteDecorator } from './delete';
import { WalnutDeleteManyDecorator } from './deleteMany';
import { WalnutListDecorator } from './list';

export interface WalnutCrudDecoratorsOptions {
  title?: AppConstLogOperateTitleType;
  DTO: string | Function;
  extra?: {
    needOperateLog?: boolean;
  };
}

export const WalnutCrudDecorators = (
  options: WalnutCrudDecoratorsOptions,
) => {
  const { title, DTO, extra = {} } = options;

  const { needOperateLog = true } = extra;

  return {
    ListDecorator: () =>
      WalnutListDecorator({
        operateLog: { title, needOperateLog },
        swagger: { DTO },
      }),

    CreateDecorator: () =>
      WalnutCreateDecorator({
        operateLog: {
          title,
          action: AppConstLogOperateAction.CREATE,
          needOperateLog,
        },
        swagger: { DTO },
      }),

    ReadDecorator: (field?: string) =>
      WalnutReadDecorator(
        {
          operateLog: { title, needOperateLog },
          swagger: { DTO },
        },
        field,
      ),

    UpdateDecorator: () =>
      WalnutUpdateDecorator({
        operateLog: {
          title,
          action: AppConstLogOperateAction.UPDATE,
          needOperateLog,
        },
        swagger: { DTO },
      }),

    DeleteDecorator: (field?: string) =>
      WalnutDeleteDecorator(
        {
          operateLog: {
            title,
            action: AppConstLogOperateAction.DELETE,
            needOperateLog,
          },
          swagger: { DTO },
        },
        field,
      ),

    DeleteManyDecorator: (field?: string) =>
      WalnutDeleteManyDecorator(
        {
          operateLog: {
            title,
            action: AppConstLogOperateAction.DELETE_MANY,
            needOperateLog,
          },
          swagger: { DTO },
        },
        field,
      ),
  };
};
