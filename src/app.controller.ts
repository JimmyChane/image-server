import { ImageListService } from '@app/image/image-list.service';
import { ImageStreamService } from '@app/image/image-stream.service';
import { LocalFileService } from '@app/local-file/local-file.service';
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
import { AccessTokenGuard } from './access-token/access-token.guard';
import { CacheControl } from './cache-control/cache-control.decorator';
import { Expires } from './expires/expires.decorator';
import { benchmark } from './util/benchmark';

@Controller()
@UseGuards(AccessTokenGuard)
export class AppController implements OnModuleInit {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly redlockService: RedlockService,
    private readonly localFileService: LocalFileService,
    private readonly imagelistService: ImageListService,
    private readonly imageStreamService: ImageStreamService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.localFileService.onModuleInit();
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
          await this.imageStreamService.streamImage(
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
    const filenames = await this.imagelistService.getStaticImageFilenames();
    return filenames.map((filename) => {
      return encodeURIComponent(filename).toString();
    });
  }
}
