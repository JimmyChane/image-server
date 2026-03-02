import { AppEnvService } from '@app/app-env/app-env.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly versionName = 'v1.0.0';
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly envService: AppEnvService) {}

  onModuleInit(): void {
    this.logger.log(`App Version ${this.versionName}`);

    this.logger.log(`APP_ENV_MODE ${this.envService.APP_ENV_MODE}`);
    this.logger.log(`APP_ALLOWED_CROSS_ORIGIN ${this.envService.APP_ALLOWED_CROSS_ORIGIN.join(', ')}`);

    this.logger.log(`Listening on http://localhost:${this.envService.APP_PORT}`);
  }
}
