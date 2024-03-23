import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types, isObjectIdOrHexString } from 'mongoose';
import { ExceptionMessage } from '../enums';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId: boolean = isObjectIdOrHexString(value);
    if (!validObjectId) {
      throw new BadRequestException(
        `Invalid ObjectId ${value}`,
        ExceptionMessage.BAD_REQUEST,
      );
    }
    return value;
  }
}
