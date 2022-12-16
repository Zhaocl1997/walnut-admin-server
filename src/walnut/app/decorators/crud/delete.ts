import { applyDecorators, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { AppConstLogOperateAction } from '../../const/decorator/logOperate';
import { LogOperateDecorator } from '../walnut/log.operate.decorator';
import { ApiWalnutOkResponse } from '../swagger/response.decorator';
import { WalnutCrudOptions } from './types';

export const WalnutDeleteDecorator = (
  options: WalnutCrudOptions,
  field: string = 'id',
) => {
  const { operateLog, swagger } = options;

  const { title, needOperateLog = true } = operateLog;

  const { DTO, description = `根据 ${field} 删除 ${title}` } = swagger;

  const decorators: MethodDecorator[] = [
    Delete(`:${field}`),
    HttpCode(HttpStatus.OK),
    ApiWalnutOkResponse({
      description,
      DTO,
    }),
    ApiParam({
      name: field,
      type: String,
      required: true,
      description: `${title} ${field}`,
    }),
  ];

  if (needOperateLog) {
    decorators.push(
      LogOperateDecorator({
        title,
        action: AppConstLogOperateAction.DELETE,
      }),
    );
  }

  return applyDecorators(...decorators);
};
