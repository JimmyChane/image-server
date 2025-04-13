import { wrapWhite } from '@/util/ConsoleTextWrapper';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  unlink,
} from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

@Injectable()
export class LocalFileService implements OnModuleInit {
  private readonly logger = new Logger(LocalFileService.name);
  private readonly PUBLIC_DIR = join(cwd(), 'public');

  onModuleInit() {
    try {
      const isExist = existsSync(this.PUBLIC_DIR);
      const isDirectory = isExist && lstatSync(this.PUBLIC_DIR).isDirectory();

      if (isDirectory) {
        this.logger.log(`Directory: ${wrapWhite(this.PUBLIC_DIR)}`);
        return;
      }
      mkdirSync(this.PUBLIC_DIR, { recursive: false });
      this.logger.log(`Directory Created: ${wrapWhite(this.PUBLIC_DIR)}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private asFilenamePath(filename: string): string {
    return join(this.PUBLIC_DIR, filename);
  }

  async getFilenames(): Promise<string[]> {
    return readdirSync(this.PUBLIC_DIR).filter((filename) => {
      const filePath = this.asFilenamePath(filename);
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

  async readStreamFilename(filename: string): Promise<import('fs').ReadStream> {
    filename = validateFilename(filename);
    const isFile = this.isFile(filename);
    if (!isFile) throw new Error('no such file');
    const read = createReadStream(this.asFilenamePath(filename));
    return read;
  }

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
