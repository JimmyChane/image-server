import { FilenameModel } from '@/model/Filename.model';
import { ImageDimensionModel } from '@/model/ImageDimension.model';
import {
  IMAGE_FORMAT_LIST,
  JPEG_IMAGE_FORMAT,
  JPG_IMAGE_FORMAT,
  PNG_IMAGE_FORMAT,
  WEBP_IMAGE_FORMAT,
} from '@/model/ImageFormat.model';
import { LocalFileService } from '@app/local-file/local-file.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as sharp from 'sharp';
import { ImageDimensionService } from './image-dimension.service';
import { ImageFormatService } from './image-format.service';

@Injectable()
export class ImageStreamService {
  private readonly logger = new Logger(ImageStreamService.name);

  constructor(
    private readonly localFileService: LocalFileService,
    private readonly imageFormatService: ImageFormatService,
    private readonly imageDimensionService: ImageDimensionService,
  ) {}

  async streamImage(
    name: string,
    option: { width?: number | string; height?: number | string },
    result: { contentType: (contentType: string) => void; write: (chunk: any) => void; end: () => void },
  ): Promise<void> {
    const dimenReq = new ImageDimensionModel(option.width, option.height);
    const filenameReq = new FilenameModel(name);

    const filenameSrc = await (async () => {
      const filenameSrc = new FilenameModel(name);

      const isFile = await this.localFileService.isFile(filenameSrc.toString());
      if (isFile) return filenameSrc;

      const formats = await this.imageFormatService.getFormatsByName(filenameReq.name);
      const [format] = formats;
      if (format) return new FilenameModel(filenameReq.name, format.ext);

      return undefined;
    })();
    if (!filenameSrc) throw new NotFoundException('no files found');

    // checking supported format
    const format = IMAGE_FORMAT_LIST.find((format) => format.ext === filenameReq.ext);
    if (!format) throw new BadRequestException('format not support');

    result.contentType(format.mimetype);

    let transformer: sharp.Sharp | undefined = undefined;

    // transform size
    transformer = await (async () => {
      if (!dimenReq.isSet()) return undefined;

      const dimenImg = await this.imageDimensionService.getFileDimensionByFilename(filenameSrc.toString());

      const isSameWidth = dimenReq.width === dimenImg?.width;
      const isSameHeight = dimenReq.height === dimenImg?.height;
      const onlyWidth = dimenReq.width && !dimenReq.height;
      const onlyHeight = !dimenReq.width && dimenReq.height;

      const isSameDimension = isSameWidth && isSameHeight;
      const onlySameWidth = onlyWidth && isSameWidth;
      const onlySameHeight = onlyHeight && isSameHeight;

      if (isSameDimension || onlySameWidth || onlySameHeight) {
        return undefined;
      }

      if ((dimenReq.width ?? 0) > (dimenImg?.width ?? 0)) {
        dimenReq.width = dimenImg?.width;
      }
      if ((dimenReq.height ?? 0) > (dimenImg?.height ?? 0)) {
        dimenReq.height = dimenImg?.height;
      }

      if (dimenReq.width === 0) dimenReq.width = undefined;
      if (dimenReq.height === 0) dimenReq.height = undefined;

      return sharp().resize(dimenReq);
    })();

    // transform media type
    if (filenameReq.ext !== filenameSrc.ext) {
      const newTransformer = (() => {
        if (transformer) return transformer;

        return sharp();
      })();

      switch (filenameReq.ext) {
        case PNG_IMAGE_FORMAT.ext:
          newTransformer.png();
          break;
        case JPG_IMAGE_FORMAT.ext:
        case JPEG_IMAGE_FORMAT.ext:
          newTransformer.jpeg();
          break;
        case WEBP_IMAGE_FORMAT.ext:
          newTransformer.webp();
          break;
      }

      transformer = newTransformer;
    }

    const readStream = await (async () => {
      const readStream = await this.localFileService.readStreamFilename(filenameSrc.toString());
      if (!transformer) return readStream;

      return readStream.pipe(transformer);
    })();
    readStream.on('data', (chunk: any) => result.write(chunk));
    readStream.on('end', () => result.end());
    readStream.on('error', (error: any) => {
      this.logger.error(error);
      throw new InternalServerErrorException('read fail');
    });
  }
}
