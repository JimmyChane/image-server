import { MaybeUndefined } from '@chanzor/utils';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService, JwtAccessPayload } from '../auth.service';
import { AuthUserStateEnum } from '../enum/auth-user-state.enum';

@Injectable()
export class AuthAccessTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token?.length) throw new UnauthorizedException('Access token missing');

    try {
      const payload: MaybeUndefined<Partial<JwtAccessPayload>> = await this.jwtService.verifyAsync(token);

      const userId = payload?.userId;
      if (!userId || typeof userId !== 'string' || !userId.length) {
        throw new UnauthorizedException('Invalid user id');
      }

      const state = await this.authService.getUserState(userId);
      if (state !== AuthUserStateEnum.ACTIVE) {
        throw new UnauthorizedException('Session expired or user logged out');
      }

      request['user'] = payload;
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      } else {
        throw new UnauthorizedException('Invalid access token');
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
