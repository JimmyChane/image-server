import { LocalFileService } from '@app/local-file/local-file.service';
import { unlink } from 'node:fs';
import { LocalFileValidateHandler } from './local-file-validate.handler';

export class LocalFileDeleteHandler {
  private readonly localFileValidateHandler = new LocalFileValidateHandler();

  constructor(private readonly localFileService: () => LocalFileService) {}

  async deleteOne(filename: string): Promise<string | null> {
    const validatedFilename = this.localFileValidateHandler.validateFilename(filename);
    const isFile = this.localFileService().isFile(validatedFilename);
    if (!isFile) return null;

    const absolutePath = this.localFileService().getAbsolutePathOfFilename(validatedFilename);
    return new Promise((resolve, reject) => {
      unlink(absolutePath, (error) => {
        if (error) reject(error);
        else resolve(validatedFilename);
      });
    });
  }
}
