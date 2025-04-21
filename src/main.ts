import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { CorsOptions } from 'cors';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'process';
import { AppModule } from './app.module';
import { isProduction } from './config';

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
  const configService = app.get(ConfigService);

  const corsOption = (() => {
    if (!isProduction()) return;

    const ALLOWED_CROSS_ORIGINS = configService.get<unknown>('ALLOWED_CROSS_ORIGINS');
    if (typeof ALLOWED_CROSS_ORIGINS !== 'string') {
      throw new Error('ALLOWED_CROSS_ORIGINS is not defined');
    }

    const option: CorsOptions = {
      origin: (origin, callback) => {
        if (!origin || ALLOWED_CROSS_ORIGINS.includes(origin)) {
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

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`http://localhost:${port}`);
}

bootstrap();
