import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import { BcryptjsModule } from 'src/modules/bcryptjs/bcryptjs.module';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';
import { VerificationService } from './services/verification.service';
import { VerificationResolver } from './resolvers/verification.resolver';

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
  providers: [AuthService, AuthResolver, JwtStrategy, JwtRefreshStrategy, VerificationService, VerificationResolver],
})
export class AuthModule {}
