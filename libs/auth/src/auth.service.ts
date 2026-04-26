import { UserDocument } from '@app/user/user.schema';
import { UserService } from '@app/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface JwtPayload {
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: UserDocument): Promise<{ access_token: string }> {
    const payload: JwtPayload = { username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }
}
