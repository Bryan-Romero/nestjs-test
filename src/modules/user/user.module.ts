import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BcryptjsModule } from 'src/modules/bcryptjs/bcryptjs.module';
import { UserPasswordController } from './controllers/user-password.controller';
import { UserController } from './controllers/user.controller';
import { User, UserSchema } from './entities/user.entity';
import { UserPasswordService } from './services/user-password.service';
import { UserService } from './services/user.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BcryptjsModule,
  ],
  controllers: [UserController, UserPasswordController],
  providers: [UserService, UserPasswordService],
  exports: [
    UserService,
    UserPasswordService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UserModule {}
