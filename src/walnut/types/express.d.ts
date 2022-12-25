import { IResult } from 'ua-parser-js';
import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface User extends IWalnutTokenPayload {}
  }

  interface IWalnutRequest extends Request {
    id?: string;
    realIp?: string;
    fingerprint?: string;
    userAgent?: IResult;
    os: string;
    browser: string;
    engine: string
    timezone?: string;
    timestamp?: number;
    language?: string;
    version?: string;
    repoVersion?: string;
    location?: string;
  }

  interface IWalnutResponse extends Response {}
}

export {};
