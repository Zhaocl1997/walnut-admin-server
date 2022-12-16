import { applyDecorators, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { AppConstLogOperateAction } from '../../const/decorator/logOperate';
import { LogOperateDecorator } from '../walnut/log.operate.decorator';
import { ApiWalnutOkResponse } from '../swagger/response.decorator';
import { WalnutCrudOptions } from './types';

export const WalnutUpdateDecorator = (options: WalnutCrudOptions) => {
  const { operateLog, swagger } = options;

  const { title, needOperateLog = true } = operateLog;

  const { DTO, description = `修改 ${title}` } = swagger;

  const decorators: MethodDecorator[] = [
    Put(),
    HttpCode(HttpStatus.OK),
    ApiWalnutOkResponse({
      description,
      DTO,
    }),
  ];

  if (needOperateLog) {
    decorators.push(
      LogOperateDecorator({
        title,
        action: AppConstLogOperateAction.UPDATE,
      }),
    );
  }

  return applyDecorators(...decorators);
};
