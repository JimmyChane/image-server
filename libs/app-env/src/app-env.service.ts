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

  readonly MONGODB_URI: string = '';

  readonly JWT_SECRET: string = '';

  constructor(configService: ConfigService) {
    this.APP_PORT = requireEnvPort(configService, 'PORT');
    this.APP_ENV_MODE = requireEnvMode(configService, 'NODE_ENV');
    this.APP_ALLOWED_CROSS_ORIGIN = optionalEnvAllowedCrossOrigin(configService, 'ALLOWED_CROSS_ORIGIN') ?? [];
    this.APP_ACCESS_TOKEN = optionalEnvAccessToken(configService, 'ACCESS_TOKEN') ?? '';

    // const mongoUri = configService.get('MONGODB_URI');
    // if (typeof mongoUri !== 'string') throw new Error('MONGODB_URI is not a string');
    // const mongoUriString = mongoUri.trim();
    // if (mongoUriString.length === 0) throw new Error('MONGODB_URI is empty');
    // this.MONGODB_URI = mongoUriString;

    // const jwtSecret = configService.get('JWT_SECRET');
    // if (typeof jwtSecret !== 'string') throw new Error('JWT_SECRET must be a string');
    // const jwtSecretString = jwtSecret.trim();
    // if (!jwtSecretString.length) throw new Error('JWT_SECRET must not be empty');
    // this.JWT_SECRET = jwtSecretString;
  }
}
