import { wrapWhite } from '@/util/ConsoleTextWrapper';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { lstat } from 'fs/promises';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  lstatSync,
  readdirSync,
  ReadStream,
  unlink,
  WriteStream,
} from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';

@Injectable()
export class LocalFileHandler implements OnModuleInit {
  private readonly logger = new Logger(LocalFileHandler.name);

  private readonly PUBLIC_DIR = join(cwd(), '/temp/image_storage');
  private readonly INIT_CREATE_FOLDER: boolean = false;

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

  private asFilenamePath(filename: string): string {
    return join(this.PUBLIC_DIR, filename);
  }

  async getFilenames(): Promise<string[]> {
    return readdirSync(this.PUBLIC_DIR).filter((filename) => {
      const filePath = this.asFilenamePath(filename);
      // TODO: detect supported file types
      // if (!filePath.endsWith('.jpg')) return false;
      return existsSync(filePath) && lstatSync(filePath).isFile();
    });
  }

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

  async readStreamFilename(filename: string): Promise<ReadStream> {
    filename = validateFilename(filename);
    const isFile = this.isFile(filename);
    if (!isFile) throw new Error('no such file');
    const read = createReadStream(this.asFilenamePath(filename));
    return read;
  }

  async writeStreamFilename(filename: string): Promise<WriteStream> {
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

export function filenameStartsWiths(filename: string, ...characters: string[]): string {
  for (const character of characters) {
    if (filename.startsWith(character)) return character;
  }
  return '';
}
export function filenameIncludes(filename: string, ...characters: string[]): string {
  for (const character of characters) {
    if (filename.includes(character)) return character;
  }
  return '';
}
export function validateFilename(filename: string): string {
  if (typeof filename !== 'string') {
    throw new Error(`filename is not string, ${filename}`);
  }

  const invalidStart = filenameStartsWiths(filename, ...['.', '/', '\\']);
  if (invalidStart) {
    throw new Error(`invalid filename format, ${filename}, ${invalidStart}`);
  }

  const invalidCharacters = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
  const invalidChar = filenameIncludes(filename, ...invalidCharacters);
  if (invalidChar) {
    throw new Error(`invalid filename character, ${filename}, ${invalidChar}`);
  }

  return filename;
}
