import { AppEnvModule } from '@app/app-env/app-env.module';
import { AppEnvService } from '@app/app-env/app-env.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [AppEnvModule],
      inject: [AppEnvService],
      useFactory: (configService: AppEnvService) => ({ uri: configService.MONGODB_URI }),
    }),
  ],
})
export class DatabaseModule {}
