import { applyDecorators, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { AppConstLogOperateAction } from '../../const/decorator/logOperate';
import { LogOperateDecorator } from '../walnut/log.operate.decorator';
import { ApiWalnutOkResponse } from '../swagger/response.decorator';
import { WalnutCrudOptions } from './types';

export const WalnutDeleteManyDecorator = (
  options: WalnutCrudOptions,
  field: string = 'ids',
) => {
  const { operateLog, swagger } = options;

  const { title, needOperateLog = true } = operateLog;

  const { DTO, description = `根据 ${field} (逗号分割)删除 ${title}` } =
    swagger;

  const decorators: MethodDecorator[] = [
    Delete(`/deleteMany/:${field}`),
    HttpCode(HttpStatus.OK),
    ApiWalnutOkResponse({
      description,
      DTO,
    }),
    ApiParam({
      name: field,
      type: String,
      required: true,
      description: `${title} ${field} 字符串，逗号分割`,
    }),
  ];

  if (needOperateLog) {
    decorators.push(
      LogOperateDecorator({
        title,
        action: AppConstLogOperateAction.DELETE_MANY,
      }),
    );
  }

  return applyDecorators(...decorators);
};
