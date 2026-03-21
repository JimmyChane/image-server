import { RedlockService } from '@app/redlock/redlock.service';
import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  Logger,
  NotFoundException,
  OnModuleInit,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExecutionError } from 'redlock';
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
    fileTypes: Object.values(IMAGE_FORMAT_MAPS).reduce((formats: string[], image) => {
      formats.push(image.ext.toLowerCase());
      formats.push(image.ext.toUpperCase());
      return formats;
    }, []),
  });
  private readonly imageListHandler = new ImageListHandler(() => this.localFile);
  private readonly imageStreamHandler = new ImageStreamHandler(() => this.localFile);

  constructor(private readonly redlockService: RedlockService) {}

  async onModuleInit(): Promise<void> {
    await this.localFile.onModuleInit();
    this.logger.log('AppController onModuleInit');
  }

  @Get('/public/*path')
  @CacheControl({ maxAge: 604_800, public: true })
  @Expires(604_800)
  async getStaticImage(@Req() request: Request, @Res() response: Response): Promise<void> {
    const paths = request.path
      .split('/')
      .filter((p) => p.length)
      .slice(1);
    if (paths.length > 1) throw new BadRequestException('Too many paths');

    const lastPath = paths.at(-1);
    if (typeof lastPath !== 'string') throw new NotFoundException();

    const name = decodeURIComponent(lastPath);
    const width = request.query['w']?.toString();
    const height = request.query['h']?.toString();

    const error = await this.redlockService
      .using(name, 1000, async () => {
        await benchmark(this.logger, 'getStaticImage', async () => {
          await this.imageStreamHandler.streamImage(
            name,
            { width, height },
            {
              contentType: (contentType: string) => response.contentType(contentType),
              write: (chunk: any) => response.write(chunk),
              end: () => response.end(),
            },
          );
        });
      })
      .catch((e: Error) => e);

    if (error instanceof ExecutionError) throw new ConflictException();
    if (error instanceof Error) throw error;
  }

  // TODO: GET as pagable
  @Get('/api/filenames')
  async getStaticImageFilenames(): Promise<string[]> {
    const filenames = await this.imageListHandler.getStaticImageFilenames();
    return filenames.map((filename) => {
      return encodeURIComponent(filename).toString();
    });
  }
}
