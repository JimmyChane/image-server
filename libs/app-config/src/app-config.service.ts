import { AppEnvService } from '@app/app-env/app-env.service';
import { buildConfigCorsOption, isConfigProd } from '@chanzor/nest-leaf';
import { Injectable } from '@nestjs/common';
import { CorsOptions } from 'cors';

@Injectable()
export class AppConfigService {
  constructor(private readonly envService: AppEnvService) {}

  isProduction(): boolean {
    return isConfigProd(this.envService.APP_ENV_MODE);
  }

  buildCorsOption(): CorsOptions {
    return buildConfigCorsOption(this.envService.APP_ALLOWED_CROSS_ORIGIN);
  }
}
