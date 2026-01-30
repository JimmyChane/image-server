import { wrapWhite } from '@/util/ConsoleTextWrapper';
import { Logger, OnModuleInit } from '@nestjs/common';
import { lstat } from 'fs/promises';
import { existsSync, lstatSync, ReadStream, WriteStream } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { LocalFileDeleteHandler } from './local-file-delete.handler';
import { LocalFileListHandler } from './local-file-list.handler';
import { LocalFileStreamHandler } from './local-file-stream.handler';

export class LocalFileHandler implements OnModuleInit {
  private readonly logger = new Logger(LocalFileHandler.name);

  readonly PUBLIC_DIR = join(cwd(), '/temp/image_storage');
  readonly INIT_CREATE_FOLDER: boolean = false;

  readonly FILE_TYPES: string[];

  private readonly localFileDeleteHandler = new LocalFileDeleteHandler(() => this);
  private readonly localFileListHandler = new LocalFileListHandler(() => this);
  private readonly localFileStreamHandler = new LocalFileStreamHandler(() => this);

  constructor(option: { fileTypes: string[] }) {
    for (const fileType of option.fileTypes) {
      if (fileType.includes('.')) throw new Error('fileTypes shall not include "."');
    }

    this.FILE_TYPES = option.fileTypes.map((fileType) => `.${fileType}`);
  }

  async onModuleInit(): Promise<void> {
    const isExist = existsSync(this.PUBLIC_DIR);
    const stat = await lstat(this.PUBLIC_DIR).catch((e: Error) => e);
    if (stat instanceof Error) throw new Error('Failed to read stat of directory');

    const isDirectory = isExist && stat.isDirectory();
    if (isDirectory) {
      this.logger.log(`Directory: ${wrapWhite(this.PUBLIC_DIR)}`);
      return;
    }

    if (!this.INIT_CREATE_FOLDER) {
      throw new Error(`Directory Not Found: ${wrapWhite(this.PUBLIC_DIR)}`);
    }

    const mkdirError = await mkdir(this.PUBLIC_DIR, { recursive: false }).catch((e: Error) => e);
    if (mkdirError instanceof Error) throw new Error('Failed to create directory');

    this.logger.log(`Directory Created: ${wrapWhite(this.PUBLIC_DIR)}`);
  }

  async getList(): Promise<string[]> {
    return this.localFileListHandler.getList();
  }

  async readStreamFilename(filename: string): Promise<ReadStream> {
    return this.localFileStreamHandler.readStreamFilename(filename);
  }

  async writeStreamFilename(filename: string): Promise<WriteStream> {
    return this.localFileStreamHandler.writeStreamFilename(filename);
  }

  isFile(filename: string): boolean {
    const filePath = this.getAbsolutePathOfFilename(filename);
    return existsSync(filePath) && lstatSync(filePath).isFile();
  }

  getAbsolutePathOfFilename(filename: string): string {
    return join(this.PUBLIC_DIR, filename);
  }
}
