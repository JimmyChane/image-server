import { AccessTokenGuard } from '@/access-token/access-token.guard';
import { CacheControl } from '@/cache-control/cache-control.decorator';
import { Expires } from '@/expires/expires.decorator';
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ColorPaletteResDto } from './dto/image-palette.res.dto';
import { ImageService } from './image.service';

@Controller()
@UseGuards(AccessTokenGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/list')
  async getList(): Promise<string[]> {
    return this.imageService.getList();
  }

  @Get('/one/:filename')
  @CacheControl({ maxAge: 604_800, public: true })
  @Expires(604_800)
  async streamOneV2(
    @Param('filename') filename: unknown,
    @Query('w') width: unknown,
    @Query('h') height: unknown,
    @Res() response: Response,
  ): Promise<void> {
    if (typeof filename !== 'string') {
      throw new BadRequestException('Invalid filename');
    }

    if (
      typeof width !== 'string' &&
      typeof width !== 'number' &&
      width !== undefined
    ) {
      throw new BadRequestException('Invalid width');
    }
    if (
      typeof height !== 'string' &&
      typeof height !== 'number' &&
      height !== undefined
    ) {
      throw new BadRequestException('Invalid height');
    }

    return this.imageService.streamOne(
      { filename, width, height },
      {
        contentType: (contentType: string) => response.contentType(contentType),
        write: (chunk: any) => response.write(chunk),
        end: () => response.end(),
      },
    );
  }

  @Get('/one/:filename/palette')
  async getPallette(
    @Param('filename') filename: string,
  ): Promise<ColorPaletteResDto> {
    return this.imageService.getOnePallette(filename);
  }
}
