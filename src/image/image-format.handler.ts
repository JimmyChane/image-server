import { LocalFileHandler } from '@/local-file/local-file.handler';
import { FilenameModel } from '@/model/Filename.model';
import { IMAGE_FORMAT_LIST, ImageFormatModel } from '@/model/ImageFormat.model';

export class ImageFormatHandler {
  constructor(private readonly localFile: () => LocalFileHandler) {}

  async getFormatsByName(name: string): Promise<ImageFormatModel[]> {
    const formats: ImageFormatModel[] = [];
    for (const format of IMAGE_FORMAT_LIST) {
      const filename = new FilenameModel(name, format.ext);
      const isFile = this.localFile().isFile(filename.toString());
      if (isFile) formats.push(format);
    }
    return formats;
  }
}
