import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpMessage } from '../enums';

const x_api_key = 'x-api-key';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const apiKey = Array.isArray(request.headers[x_api_key])
      ? request.headers[x_api_key][0]
      : request.headers[x_api_key];

    if (!this.validApyKeyFromHeader(apiKey)) {
      throw new UnauthorizedException(HttpMessage.INVALID_API_KEY);
    }
    return true;
  }

  private validApyKeyFromHeader(apiKey: string | undefined): boolean {
    return apiKey === '12345';
  }
}
