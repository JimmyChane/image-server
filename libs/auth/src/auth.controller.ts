import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginReqDto } from './dto/auth-login.req.dto';
import { AuthLoginResDto } from './dto/auth-login.res.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthLoginReqDto): Promise<AuthLoginResDto> {
    return this.authService.login(body.username, body.password);
  }
}
