import { FilenameModel } from '@/model/Filename.model';
import { IMAGE_FORMAT_LIST, ImageFormatModel } from '@/model/ImageFormat.model';
import { LocalFileService } from '@app/local-file/local-file.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageFormatService {
  constructor(private readonly localFileService: LocalFileService) {}

  async getFormatsByName(name: string): Promise<ImageFormatModel[]> {
    const formats: ImageFormatModel[] = [];
    for (const format of IMAGE_FORMAT_LIST) {
      const filename = new FilenameModel(name, format.ext);
      const isFile = this.localFileService.isFile(filename.toString());
      if (isFile) formats.push(format);
    }
    return formats;
  }
}
