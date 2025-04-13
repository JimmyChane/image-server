import { LocalFileService } from '@app/local-file';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as sharp from 'sharp';
import { FilenameModel } from './model/Filename.model';
import { ImageDimensionModel } from './model/ImageDimension.model';
import {
  ImageFormatModel,
  JPEG_IMAGE_FORMAT,
  JPG_IMAGE_FORMAT,
  List,
  PNG_IMAGE_FORMAT,
  WEBP_IMAGE_FORMAT,
} from './model/ImageFormat.model';

@Injectable()
export class AppService {
  constructor(private readonly localFileService: LocalFileService) {}

  async getStaticImage(
    option: { name: string; width?: number | string; height?: number | string },
    result: { write: (chunk: any) => void; end: () => void },
  ): Promise<void> {
    const dimenReq = new ImageDimensionModel(option.width, option.height);
    const filenameReq = new FilenameModel(option.name);

    const filenameSrc = await Promise.resolve().then(async () => {
      const filenameSrc = new FilenameModel(option.name);

      const isFile = await this.isFile(filenameSrc.toString());
      if (isFile) return filenameSrc;

      const formats = await this.getFormatsByName(filenameReq.name);
      const [format] = formats;
      if (format) return new FilenameModel(filenameReq.name, format.ext);

      return null;
    });
    if (!filenameSrc) throw new NotFoundException('no files found');

    // checking supported format
    const format = List.find((format) => format.ext === filenameReq.ext);
    if (!format) throw new BadRequestException('format not support');

    // prepare transformer
    const transformer = await Promise.resolve()
      // transform size
      .then(async () => {
        if (!dimenReq.isSet()) return null;

        const dimenImg = await this.getFileDimension(filenameSrc.toString());

        const isSameWidth = dimenReq.width === dimenImg?.width;
        const isSameHeight = dimenReq.height === dimenImg?.height;
        const onlyWidth = dimenReq.width && !dimenReq.height;
        const onlyHeight = !dimenReq.width && dimenReq.height;

        const isSameDimension = isSameWidth && isSameHeight;
        const onlySameWidth = onlyWidth && isSameWidth;
        const onlySameHeight = onlyHeight && isSameHeight;

        if (isSameDimension || onlySameWidth || onlySameHeight) {
          return null;
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
      })
      // transform media type
      .then((transformer): sharp.Sharp | null => {
        if (filenameReq.ext === filenameSrc.ext) return transformer;

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

        return newTransformer;
      });

    const readStream = await (async () => {
      const readStream = await this.localFileService.readStreamFilename(filenameSrc.toString());
      if (!transformer) return readStream;

      return readStream.pipe(transformer);
    })();
    readStream.on('data', (chunk: any) => result.write(chunk));
    readStream.on('end', () => result.end());
    readStream.on('error', (error: any) => {
      console.error(error);
      throw new InternalServerErrorException('read fail');
    });
  }
  async getStaticImageFilenames(): Promise<string[]> {
    return this.localFileService.getFilenames();
  }

  private async getFileDimension(
    filename: string = '',
  ): Promise<{ width?: number; height?: number } | undefined> {
    const storage = this.localFileService;
    if (!storage) return undefined;

    const filenameObj = new FilenameModel(filename);
    if (
      this.localFileService instanceof LocalFileService &&
      filenameObj.ext !== WEBP_IMAGE_FORMAT.ext
    ) {
      const absolutePath = storage.getAbsolutePathOfFilename(filenameObj.toString());
      const imageStream = sharp(absolutePath);
      const metadata = await imageStream.metadata();
      const dimen = { width: metadata.width, height: metadata.height };
      imageStream.destroy();
      return dimen;
    }

    const fileReadStream = await storage.readStreamFilename(filenameObj.toString());
    return await new Promise((resolve, reject) => {
      let width = 0;
      let height = 0;

      const sharpStream = sharp().on('info', (info) => {
        width = info.width;
        height = info.height;
      });

      fileReadStream
        .pipe(sharpStream)
        .on('data', () => {})
        .on('close', () => resolve({ width, height }))
        .on('error', (error) => reject(error));
    });
  }
  private async getFormatsByName(name: string = ''): Promise<ImageFormatModel[]> {
    const formats: ImageFormatModel[] = [];
    for (const format of List) {
      const filename = new FilenameModel(name, format.ext);
      const isFile = await this.isFile(filename.toString());
      if (isFile) formats.push(format);
    }
    return formats;
  }
  private async isFile(filename: string = ''): Promise<boolean> {
    const storage = this.localFileService;
    if (!storage) return false;

    if (this.localFileService instanceof LocalFileService) {
      return this.localFileService.isFile(filename);
    }

    return new Promise<boolean>(async (resolve, reject) => {
      let isFile = false;

      const fileStream = await storage.readStreamFilename(filename);
      const stream = fileStream.pipe(sharp().on('info', () => (isFile = true)));
      stream.on('data', () => {});
      stream.on('end', () => resolve(isFile));
      stream.on('error', (error) => resolve(false));
    });
  }
}
