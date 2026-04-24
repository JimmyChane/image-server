import { AppEnvModule } from '@app/app-env/app-env.module';
import { AppEnvService } from '@app/app-env/app-env.service';
import { UserModule } from '@app/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    AppEnvModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppEnvModule],
      inject: [AppEnvService],
      useFactory: async (configService: AppEnvService) => ({
        secret: configService.JWT_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
