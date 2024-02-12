import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomResponse } from '../interfaces';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, CustomResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponse<T>> {
    return next.handle().pipe(map((data) => ({ data, error: null })));
  }
}
