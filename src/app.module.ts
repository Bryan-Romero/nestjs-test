import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GqlConfigModule } from './modules/gql-config/gql-config.module';
import { LoggerMiddleware } from './common/middlewares';
import { MyConfigModule } from './config/my-config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { BcryptjsModule } from './modules/bcryptjs/bcryptjs.module';
import { MailModule } from './modules/mail/mail.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    MyConfigModule,
    DatabaseModule,
    GqlConfigModule,
    UserModule,
    AuthModule,
    BcryptjsModule,
    MailModule,
    MyConfigModule,
    DatabaseModule,
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
