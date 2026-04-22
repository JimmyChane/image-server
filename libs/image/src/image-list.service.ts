import { wrapWhite } from '@/util/console.text-wrapper';
import { LocalFileService } from '@app/local-file/local-file.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IMAGE_FORMAT_MAPS } from './image-format.model';

@Injectable()
export class ImageListService implements OnModuleInit {
  private readonly logger = new Logger(ImageListService.name);

  private FILE_TYPES!: string[];

  constructor(private readonly localFileService: LocalFileService) {}

  onModuleInit(): void {
    const fileTypes = Object.values(IMAGE_FORMAT_MAPS).reduce((formats: string[], image) => {
      formats.push(image.ext.toLowerCase());
      formats.push(image.ext.toUpperCase());
      return formats;
    }, []);

    for (const fileType of fileTypes) {
      if (fileType.includes('.')) throw new Error('fileTypes shall not include "."');
    }

    this.FILE_TYPES = fileTypes.map((fileType) => `.${fileType}`);

    this.logger.log(`File Types: ${wrapWhite(JSON.stringify(this.FILE_TYPES))}`);
  }

  async getList(): Promise<string[]> {
    return this.localFileService.getList(this.FILE_TYPES);
  }
}
