import { applyDecorators, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AppConstLogOperateAction } from '../../const/decorator/logOperate';
import { LogOperateDecorator } from '../walnut/log.operate.decorator';
import { ApiWalnutOkResponse } from '../swagger/response.decorator';
import { WalnutCrudOptions } from './types';

export const WalnutCreateDecorator = (options: WalnutCrudOptions) => {
  const { operateLog, swagger } = options;

  const { title, needOperateLog = true } = operateLog;

  const { DTO, description = `添加 ${title}` } = swagger;

  const decorators: MethodDecorator[] = [
    Post(),
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
        action: AppConstLogOperateAction.CREATE,
      }),
    );
  }

  return applyDecorators(...decorators);
};
