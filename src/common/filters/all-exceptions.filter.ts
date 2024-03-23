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
import { ExceptionMessage } from '../enums';
import { CustomResponse } from '../interfaces';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    if (this.configService.get<string>('node_env') === NodeEnv.DEVELOPMENT) {
      console.log(exception);
    }

    const responseBody: CustomResponse<null> = {
      data: null,
      statusCode: null,
      error: null,
    };

    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus();
      responseBody.error = exception.getResponse();

      httpAdapter.reply(ctx.getResponse(), responseBody, exception.getStatus());
    } else {
      responseBody.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody.error = new InternalServerErrorException(
        'Something went wrong',
        ExceptionMessage.INTERNAL_SERVER_ERROR,
      ).getResponse();

      httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
