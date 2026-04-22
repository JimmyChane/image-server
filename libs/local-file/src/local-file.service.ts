import { wrapWhite } from '@/util/console.text-wrapper';
import { IMAGE_FORMAT_MAPS } from '@app/image/image-format.model';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { existsSync, lstatSync, ReadStream, WriteStream } from 'fs';
import { lstat, mkdir } from 'fs/promises';
import { join } from 'path';
import { cwd } from 'process';
import { LocalFileDeleteHandler } from './handler/local-file-delete.handler';
import { LocalFileListHandler } from './handler/local-file-list.handler';
import { LocalFileStreamHandler } from './handler/local-file-stream.handler';

@Injectable()
export class LocalFileService implements OnModuleInit {
  private readonly logger = new Logger(LocalFileService.name);

  readonly PUBLIC_DIR = join(cwd(), '/temp/image_storage');
  readonly INIT_CREATE_FOLDER: boolean = false;

  readonly FILE_TYPES: string[];

  private readonly localFileDeleteHandler = new LocalFileDeleteHandler(() => this);
  private readonly localFileListHandler = new LocalFileListHandler(() => this);
  private readonly localFileStreamHandler = new LocalFileStreamHandler(() => this);

  constructor() {
    const fileTypes = Object.values(IMAGE_FORMAT_MAPS).reduce((formats: string[], image) => {
      formats.push(image.ext.toLowerCase());
      formats.push(image.ext.toUpperCase());
      return formats;
    }, []);

    for (const fileType of fileTypes) {
      if (fileType.includes('.')) throw new Error('fileTypes shall not include "."');
    }

    this.FILE_TYPES = fileTypes.map((fileType) => `.${fileType}`);
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
