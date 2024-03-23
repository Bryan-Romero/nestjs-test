import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { logger } from './common/middlewares';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigurationType } from './config/configuration.interface';
import { X_API_KEY } from './common/guards';
import { ValidationError } from 'class-validator';
import { ExceptionMessage } from './common/enums';

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
  app.use(helmet());
  app.use(compression());

  // Swagger Module
  const config = new DocumentBuilder()
    .setTitle('Nest-Test')
    .setDescription('The Nest-Test API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: X_API_KEY, in: 'header' }, X_API_KEY)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Listen
  console.log('Server listening on port: ', port);
  await app.listen(port);
}
bootstrap();
