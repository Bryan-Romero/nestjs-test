import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './common/middlewares';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigurationType } from './common/interfaces';

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
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Listen
  console.log('Server listening on port: ', port);
  await app.listen(port);
}
bootstrap();
