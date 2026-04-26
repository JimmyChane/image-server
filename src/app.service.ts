import { AppEnvService } from '@app/app-env/app-env.service';
import { ImageListService } from '@app/image/image-list.service';
import { ImageStreamService } from '@app/image/image-stream.service';
import { RedlockService } from '@app/redlock/redlock.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ExecutionError } from 'redlock';
import { benchmark } from './util/benchmark';
import { wrapWhite } from './util/console.text-wrapper';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly VERSION_NAME = 'v1.0.0';
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly envService: AppEnvService,
    private readonly redlockService: RedlockService,
    private readonly imagelistService: ImageListService,
    private readonly imageStreamService: ImageStreamService,
  ) {}

  onModuleInit(): void {
    this.logger.log(`App Version ${wrapWhite(this.VERSION_NAME)}`);

    this.logger.log(`APP_ENV_MODE ${wrapWhite(this.envService.APP_ENV_MODE)}`);
    this.logger.log(
      `APP_ALLOWED_CROSS_ORIGIN ${wrapWhite(JSON.stringify(this.envService.APP_ALLOWED_CROSS_ORIGIN))}`,
    );

    this.logger.log(
      `Listening on ${wrapWhite(`http://localhost:${this.envService.APP_PORT}`)}`,
    );
  }

  async getStaticImage(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
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
            { filename: name, width, height },
            {
              contentType: (contentType: string) =>
                response.contentType(contentType),
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
  async getStaticImageFilenames(): Promise<string[]> {
    const filenames = await this.imagelistService.getList();
    return filenames.map((filename) => {
      return encodeURIComponent(filename).toString();
    });
  }
}
