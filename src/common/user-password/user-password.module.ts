import { Module } from '@nestjs/common';
import { BcryptjsModule } from '../bcryptjs/bcryptjs.module';
import { UserPassowrdResolver } from './user-passowrd.resolver';
import { UserPasswordService } from './user-password.service';

@Module({
  imports: [BcryptjsModule],
  providers: [UserPasswordService, UserPassowrdResolver],
  exports: [UserPasswordService],
})
export class UserPasswordModule {}
