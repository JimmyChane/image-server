import { LocalFileModule } from '@app/local-file';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheControlInterceptor } from './cache-control/CacheControl.interceptor';
import { ExpiresInterceptor } from './expires/Expires.interceptor';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: join(cwd(), '.env') }), LocalFileModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: CacheControlInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ExpiresInterceptor },
  ],
})
export class AppModule {}
