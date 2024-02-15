import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationType, JwtType } from 'src/common/interfaces';
import { BcryptjsModule } from 'src/common/bcryptjs/bcryptjs.module';
import { PassportModule } from '@nestjs/passport';
import {
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
} from 'src/common/strategies';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
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
      inject: [ConfigService],
    }),
    BcryptjsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
