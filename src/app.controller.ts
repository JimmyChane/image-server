import { ImageService } from '@app/image';
import { Controller, Get, NotFoundException, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { CacheControl } from './cache-control/CacheControl.decorator';
import { Expires } from './expires/Expires.decorator';

@Controller()
export class AppController {
  constructor(private readonly imageService: ImageService) {}

  @Get('public/*path')
  @CacheControl({ maxAge: 604_800, public: true })
  @Expires(604_800)
  async getStaticImage(@Req() request: Request, @Res() response: Response): Promise<void> {
    const paths = request.path.split('/');
    const lastPath = paths.at(-1);
    if (typeof lastPath !== 'string') throw new NotFoundException();

    const name = decodeURIComponent(lastPath);
    const width = request.query['w']?.toString();
    const height = request.query['h']?.toString();

    await this.imageService.getStaticImage(
      name,
      { width, height },
      { write: (chunk: any) => response.write(chunk), end: () => response.end() },
    );
  }

  @Get('api/public/filenames')
  async getStaticImageFilenames(): Promise<string[]> {
    const filenames = await this.imageService.getStaticImageFilenames();
    return filenames.map((filename) => {
      return encodeURIComponent(filename).toString();
    });
  }
}
