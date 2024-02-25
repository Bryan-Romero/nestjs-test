import { Module } from '@nestjs/common';
import { UserPasswordService } from './user-password.service';
import { UserPasswordController } from './user-password.controller';
import { BcryptjsModule } from '../bcryptjs/bcryptjs.module';

@Module({
  imports: [BcryptjsModule],
  controllers: [UserPasswordController],
  providers: [UserPasswordService],
  exports: [UserPasswordService],
})
export class UserPasswordModule {}
