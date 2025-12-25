import { AppEnvService } from '@app/app-env/app-env.service';
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
  constructor(private readonly configService: AppEnvService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const tokenFromQuery = request.query.t;

    if (typeof tokenFromQuery !== 'string') {
      throw new HttpException('Unauthorized', 401);
    }
    if (!tokenFromQuery.length) {
      throw new HttpException('Unauthorized', 401);
    }
    if (tokenFromQuery !== this.configService.APP_ACCESS_TOKEN) {
      throw new HttpException('Unauthorized', 401);
    }

    return next.handle();
  }
}
