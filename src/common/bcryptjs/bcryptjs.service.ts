import { Injectable } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class BcryptjsService {
  async hashData(data: string) {
    return await bcryptjs.hashSync(data, 10);
  }

  async compareStringHash(data: string, hash: string) {
    return await bcryptjs.compareSync(data, hash);
  }
}
