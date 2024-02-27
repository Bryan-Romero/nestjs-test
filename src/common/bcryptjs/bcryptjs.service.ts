import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from 'bcryptjs';
import { ConfigurationType } from 'src/config/configuration.interface';

@Injectable()
export class BcryptjsService {
  constructor(
    private readonly configService: ConfigService<ConfigurationType>,
  ) {}

  async hashData(data: string) {
    const salt = this.configService.get<number>('bcryptjs_salt_rounds');
    return await bcryptjs.hashSync(data, salt);
  }

  async compareStringHash(data: string, hash: string) {
    return await bcryptjs.compareSync(data, hash);
  }
}
