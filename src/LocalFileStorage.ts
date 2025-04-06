import {
  createReadStream,
  createWriteStream,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  unlink,
} from 'node:fs';
import { basename, extname, join } from 'node:path';

import { FileStorage, validateFilename } from './FileStorage';
import { time } from './Status';

export class LocalFileStorage extends FileStorage {
  config: { absolutePath: string };

  constructor(absolutePath = '') {
    super();
    this.config = { absolutePath };
    this.initialCheck();
  }

  private initialCheck(): void {
    try {
      const { absolutePath } = this.config;
      const isExist = existsSync(absolutePath);
      const isDirectory = isExist && lstatSync(absolutePath).isDirectory();

      if (isDirectory) {
        time()
          .title(basename(__filename, extname(__filename)))
          .state('Directory')
          .message(this.config.absolutePath)
          .success();
        return;
      }
      mkdirSync(absolutePath, { recursive: false });
      time()
        .title(basename(__filename, extname(__filename)))
        .state('Directory Created')
        .message(this.config.absolutePath)
        .success();
    } catch (error) {
      if (error instanceof Error) {
        time()
          .title(basename(__filename, extname(__filename)))
          .state('Error')
          .message(error.message)
          .error();
      } else {
        time()
          .title(basename(__filename, extname(__filename)))
          .state('Error')
          .message(error)
          .error();
      }
    }
  }
  private asFilenamePath(filename: string): string {
    return join(this.config.absolutePath, filename);
  }

  // @override
  async getFilenames(): Promise<string[]> {
    return readdirSync(this.config.absolutePath).filter((filename) => {
      const filePath = this.asFilenamePath(filename);
      return existsSync(filePath) && lstatSync(filePath).isFile();
    });
  }
  // @override
  async deleteFilename(filename: string): Promise<unknown> {
    filename = validateFilename(filename);
    const isFile = this.isFile(filename);
    if (!isFile) return null;
    const filePath = this.asFilenamePath(filename);
    return await new Promise((resolve, reject) => {
      unlink(filePath, (error) => {
        if (error) reject(error);
        else resolve(filename);
      });
    });
  }
  // @override
  async readStreamFilename(filename: string): Promise<import('fs').ReadStream> {
    filename = validateFilename(filename);
    const isFile = this.isFile(filename);
    if (!isFile) throw new Error('no such file');
    const read = createReadStream(this.asFilenamePath(filename));
    return read;
  }
  // @override
  async writeStreamFilename(filename: string): Promise<import('fs').WriteStream> {
    filename = validateFilename(filename);
    const isFile = this.isFile(filename);
    if (isFile) throw new Error('file already exist');
    const write = createWriteStream(this.asFilenamePath(filename));
    return write;
  }

  isFile(filename: string): boolean {
    const filePath = this.asFilenamePath(filename);
    return existsSync(filePath) && lstatSync(filePath).isFile();
  }
  getAbsolutePathOfFilename(filename: string): string {
    return this.asFilenamePath(filename);
  }
}
