import { Module } from '@nestjs/common';
import { BcryptjsService } from './bcryptjs.service';

@Module({
  providers: [BcryptjsService],
  exports: [BcryptjsService],
})
export class BcryptjsModule {}
