// https://sharp.pixelplumbing.com
import sharp from 'sharp';
import { Readable } from 'stream';

import { Dimension } from './Dimension';
import { Filename } from './Filename';
import { ImageFormat, JPEG, JPG, List, PNG, WEBP, parseMimeTypeToExt } from './ImageFormat';
import { LocalFileStorage } from './LocalFileStorage';
import { TimeNowGetter } from './TimeNowGetter';

export class ImageStorage {
  private readonly timeNow = new TimeNowGetter();
  private readonly storage: LocalFileStorage;

  use(
    option = { cacheControl: '', expires: '' },
  ): (request: any, response: any, next: any) => void {
    return (request: any, response: any, next: any) => {
      if (option.cacheControl.length) {
        response.set('Cache-Control', option.cacheControl);
      }
      if (option.expires.length) {
        response.set('Expires', option.expires);
      }
      this.requestImage(request, response, next);
    };
  }

  private async requestImage(request: any, response: any, next: any): Promise<void> {
    if (request.method !== 'GET') {
      next();
      return;
    }

    const { path, query } = request;
    const sizeQuery = { width: query.width, height: query.height };

    const dimenReq = new Dimension(sizeQuery.width, sizeQuery.height);
    const filenameReq = new Filename(path);

    // checking existing files
    const filenameSrc = await Promise.resolve().then(async () => {
      const filenameSrc = new Filename(path);

      const isFile = await this.isFile(filenameSrc.toString());
      if (isFile) return filenameSrc;

      const formats = await this.getFormatsByName(filenameReq.name);
      const [format] = formats;
      if (format) return new Filename(filenameReq.name, format.ext);

      return null;
    });
    if (!filenameSrc) {
      response.status(404);
      response.write('no files found');
      response.end();
      return;
    }

    // checking supported format
    const format = List.find((format) => {
      return format.ext === filenameReq.ext;
    });
    if (!format) {
      response.status(400);
      response.write('format not support');
      response.end();
      return;
    }

    // prepare transformer
    const transformer = await Promise.resolve()
      // transform size
      .then(async () => {
        if (!dimenReq.isSet()) return null;

        const dimenImg: any = await this.getFileDimension(filenameSrc.toString());

        const isSameWidth = dimenReq.width === dimenImg.width;
        const isSameHeight = dimenReq.height === dimenImg.height;
        const onlyWidth = dimenReq.width && !dimenReq.height;
        const onlyHeight = !dimenReq.width && dimenReq.height;

        const isSameDimension = isSameWidth && isSameHeight;
        const onlySameWidth = onlyWidth && isSameWidth;
        const onlySameHeight = onlyHeight && isSameHeight;

        if (isSameDimension || onlySameWidth || onlySameHeight) {
          return null;
        }

        if (dimenReq.width > dimenImg.width) {
          dimenReq.width = dimenImg.width;
        }
        if (dimenReq.height > dimenImg.height) {
          dimenReq.height = dimenImg.height;
        }

        return sharp().resize(dimenReq);
      })
      // transform media type
      .then((transformer) => {
        if (filenameReq.ext === filenameSrc.ext) return transformer;

        const getTransformer = () => {
          return transformer ? transformer : (transformer = sharp());
        };

        switch (filenameReq.ext) {
          case PNG.ext:
            getTransformer().png();
            break;
          case JPG.ext:
          case JPEG.ext:
            getTransformer().jpeg();
            break;
          case WEBP.ext:
            getTransformer().webp();
            break;
        }

        return transformer;
      });

    const getReadStream = async () => {
      const readStream = await this.storage?.readStreamFilename(filenameSrc.toString());
      if (!transformer) {
        return readStream;
      }
      return readStream.pipe(transformer);
    };

    try {
      const readStream = await getReadStream();
      readStream.on('data', (chunk: any) => response.write(chunk));
      readStream.on('end', () => response.end());
      readStream.on('error', (error: any) => {
        response.status(500);
        response.write('read fail');
        response.end();
        console.error(error);
      });
    } catch (error) {
      response.status(500);
      response.write('read fail');
      response.end();
      console.error(error);
    }
  }

  constructor(storage: LocalFileStorage) {
    this.storage = storage;
  }

  isLocalFileStorage(): boolean {
    return this.storage instanceof LocalFileStorage;
  }

  private async getFileDimension(filename = ''): Promise<unknown> {
    const storage = this.storage;
    if (!storage) return { filename: undefined, isSuccess: false };

    const filenameObj = new Filename(filename);
    if (this.storage instanceof LocalFileStorage && filenameObj.ext !== WEBP.ext) {
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
  private async getFormatsByName(name = ''): Promise<ImageFormat[]> {
    const formats: ImageFormat[] = [];
    for (const format of List) {
      const filename = new Filename(name, format.ext);
      const isFile = await this.isFile(filename.toString());
      if (isFile) formats.push(format);
    }
    return formats;
  }
  private async isFile(filename = '') {
    const storage = this.storage;
    if (!storage) return { filename: undefined, isSuccess: false };

    if (this.isLocalFileStorage()) return this.storage?.isFile(filename);
    return await new Promise(async (resolve, reject) => {
      let isFile = false;

      const fileStream = await storage.readStreamFilename(filename);
      const stream = fileStream.pipe(sharp().on('info', () => (isFile = true)));
      stream.on('data', () => {});
      stream.on('end', () => resolve(isFile));
      stream.on('error', (error) => resolve(false));
    });
  }

  async getImageFilenames(): Promise<string[]> {
    return await this.storage?.getFilenames();
  }

  async deleteImageByFilename(filename = ''): Promise<string> {
    try {
      await this.storage?.deleteFilename(filename);
      return filename;
    } catch (error) {
      throw new Error('cannot delete file');
    }
  }

  async addImageByFiles(
    files: any[] = [],
  ): Promise<
    | { filename: string | undefined; isSuccess: boolean }[]
    | { filename: undefined; isSuccess: boolean }
  > {
    const storage = this.storage;
    if (!storage) return { filename: undefined, isSuccess: false };

    if (!files.length) throw new Error('empty files');

    const contextFiles = files.map((file) => {
      return { file, name: this.timeNow.get(), ext: parseMimeTypeToExt(file.mimetype) };
    });
    const promiseFiles = contextFiles.map((parse) => {
      const { file, name, ext } = parse;
      const filename = `${name}.${ext}`;

      return new Promise<string>(async (resolve) => {
        const write = await storage.writeStreamFilename(filename);
        write.on('finish', () => resolve(filename));

        const read = new Readable();
        read.pipe(write);
        read.push(file.data);
        read.push(null);
      });
    });
    const resultFiles = await Promise.allSettled(promiseFiles);
    return resultFiles.map((result) => {
      return {
        filename: result.status === 'fulfilled' ? result.value : undefined,
        isSuccess: result.status === 'fulfilled',
      };
    });
  }
  async addImageByTemps(temps: any = [], deleteTempAfter = false) {
    const storage = this.storage;
    if (!storage) return { filename: undefined, isSuccess: false };

    if (!temps.length) throw new Error('empty temps');

    const RESULT_OK = 'ok';
    const results: { filename: string; isSuccess: boolean }[] = [];
    for (const temp of temps) {
      const { name, timeout, expiry } = temp;
      const filename = new Filename(name);
      filename.name = `${this.timeNow.get()}`;

      const filenamePromise = new Promise(async (resolve, reject) => {
        const reader = await temp.readStream();
        const writer = await storage.writeStreamFilename(filename.toString());
        writer.on('close', () => resolve(RESULT_OK));
        writer.on('error', (error) => reject(error));
        reader.pipe(writer);
      });

      try {
        const result = await filenamePromise;

        if (result !== RESULT_OK) {
          throw new Error('error copying image temp');
        }

        if (deleteTempAfter) {
          await temp.delete().catch((error: any) => {});
        }

        results.push({ filename: filename.toString(), isSuccess: true });
      } catch (error) {
        results.push({ filename: filename.toString(), isSuccess: false });
      }
    }

    return results;
  }
}
