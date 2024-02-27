import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BcryptjsModule } from 'src/common/bcryptjs/bcryptjs.module';
import { PassportModule } from '@nestjs/passport';
import {
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
} from 'src/common/strategies';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService<ConfigurationType>) => {
        const { expires_in, secret } = configService.get<JwtType>('jwt');
        return {
          secret,
          signOptions: {
            expiresIn: expires_in,
          },
        };
      },
    }),
    PassportModule,
    BcryptjsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
