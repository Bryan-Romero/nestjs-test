import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ExceptionMessage } from './common/enums';
import { logger } from './common/middlewares';
import { ConfigurationType } from './config/configuration.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<ConfigurationType>);
  const prefix = configService.get<string>('prefix');
  const port = configService.get<number>('port');
  const node_env = configService.get<string>('node_env');
  console.log('Environment: ', node_env);

  // Global prefix
  app.setGlobalPrefix(prefix);

  // Cors
  app.enableCors();

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          const constraints = error.constraints;
          if (constraints) {
            return Object.values(constraints).join(', ');
          } else {
            return `${error.property} has an invalid value`;
          }
        });
        throw new BadRequestException(
          messages.join(', '),
          ExceptionMessage.BAD_REQUEST,
        );
      },
    }),
  );

  // Middlewares
  app.use(logger);
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );
  app.use(compression());

  // Listen
  console.log('Server listening on port: ', port);
  await app.listen(port);
}
bootstrap();
