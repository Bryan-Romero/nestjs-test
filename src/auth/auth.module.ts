import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BcryptjsModule } from 'src/common/bcryptjs/bcryptjs.module';
import { JwtRefreshStrategy, JwtStrategy } from 'src/common/strategies';
import { ConfigurationType, JwtType } from 'src/config/configuration.interface';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

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
  providers: [AuthService, AuthResolver, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
