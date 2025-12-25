import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppEnvService {
  readonly APP_PORT: number;
  readonly APP_ENV_MODE: 'development' | 'production';
  readonly APP_ALLOWED_CROSS_ORIGIN: string[];
  readonly APP_ACCESS_TOKEN: string;

  constructor(configService: ConfigService) {
    this.APP_PORT = (() => {
      const port = configService.get<string>('PORT');

      if (typeof port === 'number') {
        return port;
      }

      if (typeof port === 'string') {
        const portNumber = parseInt(port);
        if (!isNaN(portNumber)) {
          return portNumber;
        }
      }

      throw new Error('PORT is not defined');
    })();

    this.APP_ENV_MODE = (() => {
      const noveEnv = configService.get<string>('NODE_ENV');

      switch (noveEnv) {
        case 'development':
          return 'development';
        case 'production':
          return 'production';
        default:
          throw new Error('NODE_ENV is not defined');
      }
    })();

    this.APP_ALLOWED_CROSS_ORIGIN = (() => {
      const allowedCrossOrigins = configService.get<string>('ALLOWED_CROSS_ORIGIN');
      if (typeof allowedCrossOrigins !== 'string') return [];

      return allowedCrossOrigins.split(',').map((value) => value.trim());
    })();

    this.APP_ACCESS_TOKEN = (() => {
      const value = configService.get<string>('ACCESS_TOKEN');
      if (typeof value !== 'string') {
        throw new Error('ACCESS_TOKEN is not defined');
      }

      return value;
    })();
  }
}
