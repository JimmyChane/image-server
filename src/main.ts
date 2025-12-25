import { AppConfigService } from '@app/app-config/app-config.service';
import { AppEnvService } from '@app/app-env/app-env.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const appEnvService = app.get(AppEnvService);
  const appConfigService = app.get(AppConfigService);

  app.enableCors(appConfigService.buildCorsOption());

  await app.listen(appEnvService.APP_PORT);
}
bootstrap();
