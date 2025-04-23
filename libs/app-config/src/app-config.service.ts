import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  readonly port: number;
  readonly nodeEnv: 'development' | 'production';
  readonly allowedCrossOrigins: string[];

  constructor(configService: ConfigService) {
    this.port = (() => {
      const port = configService.get<string>('PORT');

      if (typeof port !== 'string') {
        return 3000;
      }

      const portNumber = parseInt(port);
      if (!isNaN(portNumber)) {
        return portNumber;
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

    this.allowedCrossOrigins = (() => {
      const allowedCrossOrigins = configService.get<string>('ALLOWED_CROSS_ORIGINS');
      if (typeof allowedCrossOrigins !== 'string') return [];

      return allowedCrossOrigins.split(',').map((value) => value.trim());
    })();
  }
}
