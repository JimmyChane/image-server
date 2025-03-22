import { ReadStream, WriteStream } from "fs";

export default abstract class FileStorage {
  static filenameStartsWiths(filename, ...characters) {
    for (let character of characters) {
      if (filename.startsWith(character)) return character;
    }
    return "";
  }
  static filenameIncludes(filename, ...characters) {
    for (let character of characters) {
      if (filename.includes(character)) return character;
    }
    return "";
  }
  static validateFilename(filename) {
    if (typeof filename !== "string") {
      throw new Error(`filename is not string, ${filename}`);
    }

    let invalidStart = this.filenameStartsWiths(filename, [".", "/", "\\"]);
    if (invalidStart) {
      throw new Error(`invalid filename format, ${filename}, ${invalidStart}`);
    }

    let invalidCharacters = ["\\", "/", ":", "*", "?", '"', "<", ">", "|"];
    let invalidChar = this.filenameIncludes(filename, invalidCharacters);
    if (invalidChar) {
      throw new Error(
        `invalid filename character, ${filename}, ${invalidChar}`,
      );
    }

    return filename;
  }

  constructor() {}
  abstract getFilenames(): Promise<string[]>;
  abstract deleteFilename(filename): Promise<any>;
  abstract readStreamFilename(filename): Promise<ReadStream>;
  abstract writeStreamFilename(filename): Promise<WriteStream>;
}
