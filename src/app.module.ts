import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BcryptjsModule } from './common/bcryptjs/bcryptjs.module';
import { GqlConfigModule } from './common/gql-config/gql-config.module';
import { MailModule } from './common/mail/mail.module';
import { LoggerMiddleware } from './common/middlewares';
import { UserPasswordModule } from './common/user-password/user-password.module';
import { configuration } from './config/configuration';
import {
  ConfigurationType,
  DatabaseType,
} from './config/configuration.interface';
import { validationSchema } from './config/validation';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        join(process.cwd(), `src/config/env/.env.${process.env.NODE_ENV}`),
      ],
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<ConfigurationType>) => ({
        uri: configService.get<DatabaseType>('database').uri,
      }),
    }),
    GqlConfigModule,
    UserModule,
    AuthModule,
    BcryptjsModule,
    MailModule,
    UserPasswordModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '/*',
    });
  }
}
