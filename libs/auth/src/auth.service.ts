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
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<AuthLoginResDto> {
    const user = await this.userService.findOneByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!(await this.userService.comparePassword(password, user.password))) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }
}
