import { Controller, Get, NotFoundException, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { CacheControl } from './cache-control/CacheControl.decorator';
import { Expires } from './expires/Expires.decorator';

@Controller()
@CacheControl({ maxAge: 604_800, public: true })
@Expires(604_800)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('public/*path')
  async getStaticImage(@Req() request: Request, @Res() response: Response): Promise<void> {
    const paths = request.path.split('/');
    const name = paths.at(-1);
    if (typeof name !== 'string') throw new NotFoundException();

    const width = request.query['w'];
    const height = request.query['h'];

    await this.appService.getStaticImage(
      { name, width: width?.toString(), height: height?.toString() },
      { write: (chunk: any) => response.write(chunk), end: () => response.end() },
    );
  }

  @Get('api/public/filenames')
  getStaticImageFilenames(): Promise<string[]> {
    return this.appService.getStaticImageFilenames();
  }
}
