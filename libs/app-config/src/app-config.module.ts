import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { cwd } from 'process';
import { AppConfigService } from './app-config.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: join(cwd(), '.env') })],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
