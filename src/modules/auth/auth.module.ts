import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import {
  JwtRefreshStrategy,
  JwtStrategy,
  LocalStrategy,
} from 'src/modules/auth/strategies';
import { BcryptjsModule } from 'src/modules/bcryptjs/bcryptjs.module';
import { AuthController } from './controllers/auth.controller';
import { VerificationController } from './controllers/verification.controller';
import { AuthService } from './services/auth.service';
import { VerificationService } from './services/verification.service';

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
  controllers: [AuthController, VerificationController],
  providers: [
    AuthService,
    VerificationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
