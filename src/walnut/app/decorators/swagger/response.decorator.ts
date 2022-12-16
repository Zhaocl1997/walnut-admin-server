import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { WalnutApiResponseSchemeData } from './ok.response';

export interface ApiWalnutOkResponseOptions {
  DTO: string | Function;

  description?: string;
}

export const ApiWalnutOkResponse = ({
  description,
  DTO,
}: ApiWalnutOkResponseOptions) => {
  return ApiOkResponse({
    description,
    schema: WalnutApiResponseSchemeData({
      type: 'object',
      $ref: getSchemaPath(DTO),
    }),
  });
};
