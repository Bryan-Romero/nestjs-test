import { Module } from '@nestjs/common';
import { BcryptjsModule } from '../bcryptjs/bcryptjs.module';
import { UserPasswordController } from './user-password.controller';
import { UserPasswordService } from './user-password.service';

@Module({
  imports: [BcryptjsModule],
  controllers: [UserPasswordController],
  providers: [UserPasswordService],
  exports: [UserPasswordService],
})
export class UserPasswordModule {}
