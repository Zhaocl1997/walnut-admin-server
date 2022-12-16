import { applyDecorators, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { WalnutListResponseDTO } from '../../common/dto/list.dto';

import { WalnutApiResponseSchemeData } from '../swagger/ok.response';
import { WalnutCrudOptions } from './types';

export const WalnutListDecorator = (options: WalnutCrudOptions) => {
  const { operateLog, swagger } = options;

  const { title } = operateLog;

  const { DTO, description = `${title} 列表` } = swagger;

  return applyDecorators(
    Post('list'),
    HttpCode(HttpStatus.OK),
    ApiExtraModels(WalnutListResponseDTO, DTO as Function),
    ApiOkResponse({
      description,
      schema: WalnutApiResponseSchemeData({
        type: 'array',
        items: {
          allOf: [
            { $ref: getSchemaPath(WalnutListResponseDTO) },
            {
              properties: {
                data: {
                  type: 'array',
                  items: { $ref: getSchemaPath(DTO) },
                },
              },
            },
          ],
        },
      }),
    }),
  );
};
