import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthExchangeReqDto } from './dto/auth-exchange.req.dto';
import { AuthLoginReqDto } from './dto/auth-login.req.dto';
import { AuthAccessResDto, AuthLoginResDto } from './dto/auth-login.res.dto';
import { AuthRefreshReqDto } from './dto/auth-refresh.req.dto';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthLoginReqDto): Promise<AuthLoginResDto> {
    return this.authService.login(body);
  }

  @Post('exchange')
  async exchange(@Body() body: AuthExchangeReqDto): Promise<AuthAccessResDto> {
    return this.authService.exchangeLoginToken(body);
  }

  @Post('refresh')
  async refresh(@Body() body: AuthRefreshReqDto): Promise<AuthAccessResDto> {
    return this.authService.refreshTokens(body);
  }
}
