import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BcryptjsModule } from 'src/common/bcryptjs/bcryptjs.module';
import { User, UserSchema } from './entities/user.entity';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    BcryptjsModule,
  ],
  providers: [UserService, UserResolver],
  exports: [
    UserService,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class UserModule {}
