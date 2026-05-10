import { Controller, Get, Header } from '@nestjs/common';
import { HeatlhResDto } from './health.res.dto';

// TODO: add throttler

@Controller()
export class HealthController {
  @Get('/')
  @Header('Content-Type', 'application/json')
  check(): HeatlhResDto {
    return { status: 'ok' };
  }
}
