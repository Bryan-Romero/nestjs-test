import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import { validationSchema } from './validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [
        `${process.cwd()}/src/config/env/.env.${process.env.NODE_ENV}`,
      ],
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
  ],
})
export class MyConfigModule {}
