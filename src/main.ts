import { AppConfigService } from '@app/app-config';
import { NestFactory } from '@nestjs/core';
import { CorsOptions } from 'cors';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'process';
import { AppModule } from './app.module';

function isProduction(): boolean {
  switch (process.env['NODE_ENV']) {
    case 'development':
      return false;
    case 'production':
      return true;
    default:
      throw new Error('NODE_ENV is not defined');
  }
}

async function bootstrap() {
  const httpsOptions = (() => {
    if (!isProduction()) return;

    const privateKeyPath = join(cwd(), 'ss/privkey.pem');
    const certificatePath = join(cwd(), 'ssl/cert.pem');

    const key = readFileSync(privateKeyPath, 'utf-8');
    const cert = readFileSync(certificatePath, 'utf-8');

    return { key, cert };
  })();

  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get(AppConfigService);

  const corsOption = (() => {
    if (!isProduction()) return;

    if (!configService.allowedCrossOrigins.length) {
      throw new Error('ALLOWED_CROSS_ORIGINS is not defined');
    }

    const option: CorsOptions = {
      origin: (origin, callback) => {
        if (!origin || configService.allowedCrossOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true,
    };

    return option;
  })();

  app.enableCors(corsOption);

  await app.listen(configService.port);
  console.log(`http://localhost:${configService.port}`);
}
bootstrap();
