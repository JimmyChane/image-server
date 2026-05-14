import { AppEnvModule } from '@app/app-env/app-env.module';
import { AppEnvService } from '@app/app-env/app-env.service';
import { RedisModule } from '@app/redis/redis.module';
import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { acquireAuthEnv } from './auth.util';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    AppEnvModule,
    PassportModule,
    RedisModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [AppEnvModule],
      inject: [AppEnvService],
      useFactory: (appEnvService: AppEnvService) => {
        const { JWT_SECRET } = acquireAuthEnv(appEnvService);
        return { secret: JWT_SECRET, signOptions: { expiresIn: '1h' } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
