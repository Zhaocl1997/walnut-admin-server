import { AppConstResponseCode } from '../const/app/responseCode';

// base response structure
export const WalnutBaseResponse = <T>(
  data: T,
  code: number,
  msg: string,
): IWalnutResponseBase<T> => ({
  data,
  code,
  msg,
});

// success
export const WalnutResponseSuccess = <T>(
  data: T,
  msg: string = `response.${AppConstResponseCode['2000']}`,
) => WalnutBaseResponse<T>(data, AppConstResponseCode['2000'], msg);

// exception
export const WalnutResponseException = <T>(
  exception: Partial<Pick<IWalnutExceptionBase, 'errCode' | 'errMsg'>>,
) =>
  WalnutBaseResponse<T>(
    null,
    exception.errCode,
    exception.errMsg ?? `response.${exception.errCode}`,
  );
