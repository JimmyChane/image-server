import { AppConfigModule } from '@app/app-config/app-config.module';
import { AppEnvModule } from '@app/app-env/app-env.module';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheControlInterceptor } from './cache-control/CacheControl.interceptor';
import { ExpiresInterceptor } from './expires/Expires.interceptor';

@Module({
  imports: [AppEnvModule, AppConfigModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: CacheControlInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ExpiresInterceptor },
  ],
})
export class AppModule {}
