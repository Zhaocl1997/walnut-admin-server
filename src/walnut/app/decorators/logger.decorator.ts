import {
  applyDecorators,
  SetMetadata,
  UseInterceptors,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActionType } from './actionType';
import { LogService } from '../system/logs/log.service';

const getRequestIP = (req) => {
  return (req.headers['x-forwarded-for'] || '').split(',')[0] || req.ip;
};

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector, private logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const title = this.reflector.get<string>('LOG_TITLE', context.getHandler());

    const action = this.reflector.get<ActionType>(
      'LOG_ACTION',
      context.getHandler(),
    );

    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    const log = {
      title,
      action,
      method: request.method,
      url: request.url.replace('/dev-api/v1', ''),
      httpVersion: request.httpVersion,
      agent: request.headers['user-agent'],
      statusCode: response.statusCode,
      // @ts-ignore
      userId: request.user.userId,
      ip: getRequestIP(request),
    };

    return next.handle().pipe(
      tap(async () => {
        await this.logService.create(log);
      }),
    );
  }
}

class LogClass {
  title: string;
  action: ActionType;
}

export const Log = (log: LogClass) => {
  return applyDecorators(
    SetMetadata('LOG_TITLE', log.title),
    SetMetadata('LOG_ACTION', log.action),
    UseInterceptors(LogInterceptor),
  );
};
