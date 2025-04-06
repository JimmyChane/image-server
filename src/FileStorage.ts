import { ReadStream, WriteStream } from 'fs';

export function filenameStartsWiths(filename: string, ...characters: string[]) {
  for (let character of characters) {
    if (filename.startsWith(character)) return character;
  }
  return '';
}
export function filenameIncludes(filename: string, ...characters: string[]) {
  for (let character of characters) {
    if (filename.includes(character)) return character;
  }
  return '';
}
export function validateFilename(filename: string) {
  if (typeof filename !== 'string') {
    throw new Error(`filename is not string, ${filename}`);
  }

  let invalidStart = filenameStartsWiths(filename, ...['.', '/', '\\']);
  if (invalidStart) {
    throw new Error(`invalid filename format, ${filename}, ${invalidStart}`);
  }

  let invalidCharacters = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
  let invalidChar = filenameIncludes(filename, ...invalidCharacters);
  if (invalidChar) {
    throw new Error(`invalid filename character, ${filename}, ${invalidChar}`);
  }

  return filename;
}

export abstract class FileStorage {
  constructor() {}
  abstract getFilenames(): Promise<string[]>;
  abstract deleteFilename(filename: string): Promise<any>;
  abstract readStreamFilename(filename: string): Promise<ReadStream>;
  abstract writeStreamFilename(filename: string): Promise<WriteStream>;
}
