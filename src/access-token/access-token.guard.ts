import { AppEnvService } from '@app/app-env/app-env.service';
import { type CanActivate, type ExecutionContext, HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly configService: AppEnvService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    return true;
  }
}
