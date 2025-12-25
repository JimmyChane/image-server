import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppEnvService {
  readonly port: number;
  readonly nodeEnv: 'development' | 'production';
  readonly allowedCrossOrigin: string[];
  readonly token: string;

  constructor(configService: ConfigService) {
    this.port = (() => {
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

    this.nodeEnv = (() => {
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

    this.allowedCrossOrigin = (() => {
      const allowedCrossOrigins = configService.get<string>('ALLOWED_CROSS_ORIGIN');
      if (typeof allowedCrossOrigins !== 'string') return [];

      return allowedCrossOrigins.split(',').map((value) => value.trim());
    })();

    this.token = (() => {
      const value = configService.get<string>('ACCESS_TOKEN');
      if (typeof value !== 'string') {
        throw new Error('ACCESS_TOKEN is not defined');
      }

      return value;
    })();
  }
}
