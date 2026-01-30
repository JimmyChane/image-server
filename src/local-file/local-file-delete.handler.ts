import { unlink } from 'node:fs';
import { LocalFileValidateHandler } from './local-file-validate.handler';
import { LocalFileHandler } from './local-file.handler';

export class LocalFileDeleteHandler {
  private readonly localFileValidateHandler = new LocalFileValidateHandler();

  constructor(private readonly localFileHanlder: () => LocalFileHandler) {}

  async deleteOne(filename: string): Promise<string | null> {
    const validatedFilename = this.localFileValidateHandler.validateFilename(filename);
    const isFile = this.localFileHanlder().isFile(validatedFilename);
    if (!isFile) return null;

    const absolutePath = this.localFileHanlder().getAbsolutePathOfFilename(validatedFilename);
    return new Promise((resolve, reject) => {
      unlink(absolutePath, (error) => {
        if (error) reject(error);
        else resolve(validatedFilename);
      });
    });
  }
}
