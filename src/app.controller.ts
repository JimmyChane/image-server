import { ImageListService } from '@app/image/image-list.service';
import { ImageStreamService } from '@app/image/image-stream.service';
import { Controller, Get, Logger, NotFoundException, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlAccessToken } from './access-token/AccessToken.decorator';
import { CacheControl } from './cache-control/CacheControl.decorator';
import { Expires } from './expires/Expires.decorator';
import { benchmark } from './util/benchmark';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly imageListService: ImageListService,
    private readonly imageStreamService: ImageStreamService,
  ) {}

  @Get('public/*path')
  @CacheControl({ maxAge: 604_800, public: true })
  @Expires(604_800)
  @UrlAccessToken()
  async getStaticImage(@Req() request: Request, @Res() response: Response): Promise<void> {
    const paths = request.path.split('/');
    const lastPath = paths.at(-1);
    if (typeof lastPath !== 'string') throw new NotFoundException();

    const name = decodeURIComponent(lastPath);
    const width = request.query['w']?.toString();
    const height = request.query['h']?.toString();

    await benchmark(this.logger, 'getStaticImage', () => {
      return this.imageStreamService.streamImage(
        name,
        { width, height },
        {
          contentType: (contentType: string) => response.contentType(contentType),
          write: (chunk: any) => response.write(chunk),
          end: () => response.end(),
        },
      );
    });
  }

  @Get('api/public/filenames')
  @UrlAccessToken()
  async getStaticImageFilenames(): Promise<string[]> {
    const filenames = await this.imageListService.getStaticImageFilenames();
    return filenames.map((filename) => {
      return encodeURIComponent(filename).toString();
    });
  }
}
