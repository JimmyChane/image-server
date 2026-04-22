import { LocalFileService } from '@app/local-file/local-file.service';
import { FilenameModel } from '../filename.model';
import { IMAGE_FORMAT_LIST, ImageFormatModel } from '../image-format.model';

export class ImageFormatHandler {
  constructor(private readonly localFile: () => LocalFileService) {}

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
