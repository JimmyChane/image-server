import { LocalFileService } from '@app/local-file/local-file.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageListService {
  constructor(private readonly localFileService: LocalFileService) {}

  async getStaticImageFilenames(): Promise<string[]> {
    return this.localFileService.getFilenames();
  }
}
