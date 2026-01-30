import { LocalFileHandler } from '@/local-file/local-file.handler';

export class ImageListHandler {
  constructor(private readonly localFile: () => LocalFileHandler) {}

  async getStaticImageFilenames(): Promise<string[]> {
    return this.localFile().getList();
  }
}
