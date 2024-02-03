import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomResponse } from '../interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    var responseBody: CustomResponse<null> = { data: null, error: null };
    var status: number = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      responseBody = {
        data: null,
        error: exception.getResponse(),
      };
      status = exception.getStatus();
    } else {
      responseBody = {
        data: null,
        error: new InternalServerErrorException().getResponse(),
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
