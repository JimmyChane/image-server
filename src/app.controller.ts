import { Controller, Get, Logger, NotFoundException, OnModuleInit, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AccessTokenGuard } from './access-token/AccessToken.guard';
import { CacheControl } from './cache-control/CacheControl.decorator';
import { Expires } from './expires/Expires.decorator';
import { ImageListHandler } from './image/image-list.handler';
import { ImageStreamHandler } from './image/image-stream.handler';
import { LocalFileHandler } from './local-file/local-file.handler';
import { IMAGE_FORMAT_MAPS } from './model/ImageFormat.model';
import { benchmark } from './util/benchmark';

@Controller()
@UseGuards(AccessTokenGuard)
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);

  private readonly localFile = new LocalFileHandler({
    fileTypes: Object.values(IMAGE_FORMAT_MAPS).map((format) => format.ext),
  });
  private readonly imageListHandler = new ImageListHandler(() => this.localFile);
  private readonly imageStreamHandler = new ImageStreamHandler(() => this.localFile);

  onModuleInit(): Promise<void> {
    return this.localFile.onModuleInit();
  }

  @Get('/public/*path')
  @CacheControl({ maxAge: 604_800, public: true })
  @Expires(604_800)
  async getStaticImage(@Req() request: Request, @Res() response: Response): Promise<void> {
    const paths = request.path.split('/');
    const lastPath = paths.at(-1);
    if (typeof lastPath !== 'string') throw new NotFoundException();

    const name = decodeURIComponent(lastPath);
    const width = request.query['w']?.toString();
    const height = request.query['h']?.toString();

    await benchmark(this.logger, 'getStaticImage', () => {
      return this.imageStreamHandler.streamImage(
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

  @Get('/api/filenames')
  async getStaticImageFilenames(): Promise<string[]> {
    const filenames = await this.imageListHandler.getStaticImageFilenames();
    return filenames.map((filename) => {
      return encodeURIComponent(filename).toString();
    });
  }
}
