import { AppEnvService } from '@app/app-env/app-env.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CorsOptions } from 'cors';

@Injectable()
export class AppConfigService {
  constructor(private readonly envService: AppEnvService) {}

  isProduction(): boolean {
    switch (this.envService.APP_ENV_MODE) {
      case 'development':
        return false;
      case 'production':
        return true;
      default:
        throw new Error('APP_ENV_MODE is not defined');
    }
  }

  buildCorsOption(): CorsOptions {
    let origin: CorsOptions['origin'] | undefined = undefined;

    if (this.envService.APP_ALLOWED_CROSS_ORIGIN.length > 0) {
      origin = (requestOrigin: unknown, callback) => {
        if (requestOrigin === undefined) {
          callback(null, true);
          return;
        }

        if (typeof requestOrigin !== 'string') {
          throw new ForbiddenException('Not allowed by CORS');
        }

        for (const allowedOrigin of this.envService.APP_ALLOWED_CROSS_ORIGIN) {
          if (allowedOrigin.includes('*')) {
            const regex = new RegExp(
              `^${allowedOrigin.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`,
            );
            if (regex.test(requestOrigin)) {
              callback(null, true);
              return;
            }
          }

          if (allowedOrigin === requestOrigin) {
            callback(null, true);
            return;
          }
        }

        throw new ForbiddenException('Not allowed by CORS');
      };
    }

    return {
      origin,
      methods: ['GET'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'x-access-token'],
    };
  }
}
