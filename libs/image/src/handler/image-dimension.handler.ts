import { LocalFileService } from '@app/local-file/local-file.service';
import sharp from 'sharp';
import { FilenameModel } from '../filename.model';
import { WEBP_IMAGE_FORMAT } from '../image-format.model';

export class ImageDimensionHandler {
  constructor(private readonly localFile: () => LocalFileService) {}

  async getFileDimensionByFilename(filename: string): Promise<{ width?: number; height?: number } | undefined> {
    const filenameObj = new FilenameModel(filename);
    if (filenameObj.ext !== WEBP_IMAGE_FORMAT.ext) {
      const absolutePath = this.localFile().getAbsolutePathOfFilename(filenameObj.toString());
      const imageStream = sharp(absolutePath);
      const metadata = await imageStream.metadata();
      const dimen = { width: metadata.width, height: metadata.height };
      imageStream.destroy();
      return dimen;
    }

    const fileReadStream = await this.localFile().readStreamFilename(filenameObj.toString());
    return new Promise((resolve, reject) => {
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
}
