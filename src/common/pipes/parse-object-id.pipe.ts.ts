import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types, isObjectIdOrHexString } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId: boolean = isObjectIdOrHexString(value);
    if (!validObjectId) {
      throw new BadRequestException(`Invalid ObjectId ${value}`);
    }
    return value;
  }
}
