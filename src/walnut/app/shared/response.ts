import { BaseResponseStructure } from '../types/baseResponse';

export const ResponseSuccess = <T>(data: T): BaseResponseStructure<T> => {
  return {
    data,
    code: 200,
    msg: 'Success',
  };
};
