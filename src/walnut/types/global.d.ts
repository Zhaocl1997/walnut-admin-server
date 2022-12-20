declare global {
  interface AnyObject {
    [k: string]: any;
  }

  interface IWalnutExceptionBase {
    errType: string;
    errMsg: string;
    errCode: number;
  }

  interface IWalnutResponseBase<T = any> {
    data: T;
    code?: number;
    msg?: string;
  }

  interface IWalnutResponseListData<T = any> {
    data: T[];
    total: number;
  }

  type IWalnutResponseList<T = any> = IWalnutResponseBase<
    IWalnutResponseListData<T>
  >;

  interface IWalnutTokenPayload {
    userName: string;
    userId: string;
    roleIds: string[];
    roleNames: string[];
    emailAddress: string;
    phoneNumber: string;

    key?: string;
    iat?: number;
    exp?: number;
  }

  type IWalnutTokenUser = Omit<IWalnutTokenPayload, 'key' | 'iat' | 'exp'>;
}

export {};
