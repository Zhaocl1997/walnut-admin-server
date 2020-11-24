import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { Error as DatabaseException, CastError } from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log(exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message;

    if (exception instanceof HttpException) {
      message = exception.getResponse();
    }

    if (exception instanceof BadRequestException) {
      message = exception.getResponse();
    }

    if (exception instanceof UnauthorizedException) {
      message = exception.getResponse();
    }

    if (exception instanceof DatabaseException) {
      message = exception.message;

      if (exception as CastError) {
        message = exception.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      method: request.method,

      time: new Date().toLocaleString(),
      detail: message,
    });
  }
}
