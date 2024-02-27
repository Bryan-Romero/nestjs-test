import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import {
  ConfigurationType,
  MailType,
} from 'src/config/configuration.interface';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<ConfigurationType>) => {
        const mail = config.get<MailType>('mail');
        return {
          transport: {
            host: mail.host,
            port: mail.port,
            secure: false,
            auth: {
              user: mail.user,
              pass: mail.password,
            },
          },
          defaults: {
            from: `"No Reply" <${mail.from}>`,
          },
          template: {
            dir: join(__dirname, '/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

// https://notiz.dev/blog/send-emails-with-nestjs
// https://nest-modules.github.io/mailer/docs/mailer
