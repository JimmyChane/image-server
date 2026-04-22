import { LocalFileService } from '@app/local-file/local-file.service';
import { createReadStream, createWriteStream, ReadStream, WriteStream } from 'node:fs';
import { LocalFileValidateHandler } from './local-file-validate.handler';

export class LocalFileStreamHandler {
  private readonly localFileValidateHandler = new LocalFileValidateHandler();

  constructor(private readonly localFileHanlder: () => LocalFileService) {}

  async readStreamFilename(filename: string): Promise<ReadStream> {
    const validatedFilename = this.localFileValidateHandler.validateFilename(filename);

    const isFile = this.localFileHanlder().isFile(validatedFilename);
    if (!isFile) throw new Error('no such file');

    const absolutePath = this.localFileHanlder().getAbsolutePathOfFilename(validatedFilename);
    return createReadStream(absolutePath);
  }

  async writeStreamFilename(filename: string): Promise<WriteStream> {
    const validatedFilename = this.localFileValidateHandler.validateFilename(filename);

    const isFile = this.localFileHanlder().isFile(validatedFilename);
    if (isFile) throw new Error('file already exist');

    const absolutePath = this.localFileHanlder().getAbsolutePathOfFilename(validatedFilename);
    return createWriteStream(absolutePath);
  }
}
