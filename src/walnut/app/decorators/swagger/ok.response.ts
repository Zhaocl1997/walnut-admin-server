import { AppConstResponseCode } from '../../const/app/responseCode';

export const WalnutApiResponseSchemeData = (data: any) => ({
  allOf: [
    {
      properties: {
        data,
        code: {
          type: 'number',
          default: AppConstResponseCode['2000'],
        },
        msg: {
          type: 'string',
          default: 'Success',
        },
      },
    },
  ],
});
