import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { ConfigurationType } from 'src/config/configuration.interface';
import { NodeEnv } from 'src/config/node-env.enum';
import { CustomResponse } from '../interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    var responseBody: CustomResponse<null> = {
      data: null,
      statusCode: null,
      error: null,
    };
    var status: number = HttpStatus.INTERNAL_SERVER_ERROR;

    if (this.configService.get<string>('node_env') === NodeEnv.DEVELOPMENT) {
      console.log(exception);
    }

    if (exception instanceof HttpException) {
      responseBody = {
        data: null,
        statusCode: exception.getStatus(),
        error: exception.getResponse(),
      };
      status = exception.getStatus();
    } else {
      responseBody = {
        data: null,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: new InternalServerErrorException().getResponse(),
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
