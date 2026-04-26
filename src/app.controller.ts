import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AccessTokenGuard } from './access-token/access-token.guard';
import { AppService } from './app.service';
import { CacheControl } from './cache-control/cache-control.decorator';
import { Expires } from './expires/expires.decorator';

@Controller()
@UseGuards(AccessTokenGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/public/*path')
  @CacheControl({ maxAge: 604_800, public: true })
  @Expires(604_800)
  async getStaticImage(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    return this.appService.getStaticImage(request, response);
  }

  @Get('/api/filenames')
  async getStaticImageFilenames(): Promise<string[]> {
    return this.appService.getStaticImageFilenames();
  }
}
