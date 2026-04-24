import { AppConfigService } from '@app/app-config/app-config.service';
import { AppEnvService } from '@app/app-env/app-env.service';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const appEnvService = app.get(AppEnvService);
  const appConfigService = app.get(AppConfigService);

  app.enableShutdownHooks();
  app.enableCors(appConfigService.buildCorsOption());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  await app.listen(appEnvService.APP_PORT);
}
bootstrap();
