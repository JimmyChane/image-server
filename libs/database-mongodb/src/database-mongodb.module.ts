import { AppEnvModule } from '@app/app-env/app-env.module';
import { AppEnvService } from '@app/app-env/app-env.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseMongodbService } from './database-mongodb.service';
import { acquireDatabaseMongodbEnv } from './database-mongodb.util';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [AppEnvModule],
      inject: [AppEnvService],
      useFactory: (appEnvService: AppEnvService) => {
        const { MONGODB_URI } = acquireDatabaseMongodbEnv(appEnvService);
        return { uri: MONGODB_URI };
      },
    }),
  ],
  providers: [DatabaseMongodbService],
  exports: [DatabaseMongodbService],
})
export class DatabaseMongodbModule {}
