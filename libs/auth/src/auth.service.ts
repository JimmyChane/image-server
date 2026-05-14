import { UserService } from '@app/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginResDto } from './dto/auth-login.res.dto';

export interface JwtPayload {
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(username: string, password: string): Promise<AuthLoginResDto> {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatched = await this.userService.comparePassword(password, user.password);
    if (!isMatched) {
      throw new UnauthorizedException();
    }

    const accessToken = this.signPayload(user.username);
    return { access_token: accessToken };
  }

  private signPayload(username: string): string {
    const payload: JwtPayload = { username };
    return this.jwtService.sign(payload);
  }
}
