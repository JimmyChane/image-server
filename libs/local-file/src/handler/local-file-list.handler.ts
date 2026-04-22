import { LocalFileService } from '@app/local-file/local-file.service';
import { existsSync, lstatSync, readdirSync } from 'node:fs';

export class LocalFileListHandler {
  constructor(private readonly localFileHanlder: () => LocalFileService) {}

  async getList(): Promise<string[]> {
    const filenames = readdirSync(this.localFileHanlder().PUBLIC_DIR);
    const supportedFilepaths = filenames.filter((filepath) => {
      for (const FILE_TYPE of this.localFileHanlder().FILE_TYPES) {
        if (filepath.endsWith(FILE_TYPE)) return true;
      }

      return false;
    });
    return supportedFilepaths.filter((filepath) => {
      const filePath = this.localFileHanlder().getAbsolutePathOfFilename(filepath);
      return existsSync(filePath) && lstatSync(filePath).isFile();
    });
  }
}
