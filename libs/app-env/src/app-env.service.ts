import {
  optionalEnvAccessToken,
  optionalEnvAllowedCrossOrigin,
  requireEnvMode,
  requireEnvPort,
} from '@chanzor/nest-leaf';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppEnvService {
  readonly APP_PORT: number;
  readonly APP_ENV_MODE: 'dev' | 'prod';
  readonly APP_ALLOWED_CROSS_ORIGIN: string[];
  readonly APP_ACCESS_TOKEN: string;

  constructor(configService: ConfigService) {
    this.APP_PORT = requireEnvPort(configService, 'PORT');
    this.APP_ENV_MODE = requireEnvMode(configService, 'NODE_ENV');
    this.APP_ALLOWED_CROSS_ORIGIN = optionalEnvAllowedCrossOrigin(configService, 'ALLOWED_CROSS_ORIGIN') ?? [];
    this.APP_ACCESS_TOKEN = optionalEnvAccessToken(configService, 'ACCESS_TOKEN') ?? '';
  }
}
