import { AppConfigService } from '@app/app-config';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export const ACCESS_TOKEN_METADATA_KEY = 'access-token';

@Injectable()
export class AccessTokenInterceptor implements NestInterceptor {
  constructor(private readonly configService: AppConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tokenFromQuery = request.query.t;

    if (typeof tokenFromQuery !== 'string') {
      throw new HttpException('Unauthorized', 401);
    }
    if (!tokenFromQuery.length) {
      throw new HttpException('Unauthorized', 401);
    }
    if (tokenFromQuery !== this.configService.token) {
      throw new HttpException('Unauthorized', 401);
    }

    return next.handle();
  }
}
