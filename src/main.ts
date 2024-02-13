import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './common/middlewares';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigurationType } from './common/interfaces';
import helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<ConfigurationType>);
  const prefix = configService.get<string>('prefix');
  const port = configService.get<number>('port');
  const NODE_ENV = configService.get<string>('NODE_ENV');
  console.log('Environment: ', NODE_ENV);

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
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Listen
  console.log('Server listening on port: ', port);
  await app.listen(port);
}
bootstrap();
