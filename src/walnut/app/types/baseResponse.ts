export interface BaseResponseStructure<T = any> {
  code?: number;

  msg?: string;

  data: T;
}
