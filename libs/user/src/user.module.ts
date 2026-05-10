import { AppEnvModule } from '@app/app-env/app-env.module';
import { DatabaseMongodbModule } from '@app/database-mongodb/database-mongodb.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseMongodbModule,
    AppEnvModule,
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
