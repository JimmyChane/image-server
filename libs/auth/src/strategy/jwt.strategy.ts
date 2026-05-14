import { AppEnvService } from '@app/app-env/app-env.service';
import { getString } from '@chanzor/utils';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.service';
import { acquireAuthEnv } from '../auth.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(appEnvService: AppEnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: acquireAuthEnv(appEnvService).JWT_SECRET,
    });
  }

  async validate(payload: Partial<JwtPayload>) {
    const username = getString(payload.username);

    return { username };
  }
}
