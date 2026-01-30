export class LocalFileValidateHandler {
  private readonly INVALID_STARTS = ['.', '/', '\\'];
  private readonly INVALID_CHARS = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];

  private filenameStartsWiths(filename: string, ...characters: string[]): string {
    for (const character of characters) {
      if (filename.startsWith(character)) return character;
    }
    return '';
  }

  private filenameIncludes(filename: string, ...characters: string[]): string {
    for (const character of characters) {
      if (filename.includes(character)) return character;
    }
    return '';
  }

  validateFilename(filename: string): string {
    const invalidStart = this.filenameStartsWiths(filename, ...this.INVALID_STARTS);
    if (invalidStart) {
      throw new Error(`invalid filename format, ${filename}, ${invalidStart}`);
    }

    const invalidChar = this.filenameIncludes(filename, ...this.INVALID_CHARS);
    if (invalidChar) {
      throw new Error(`invalid filename character, ${filename}, ${invalidChar}`);
    }

    return filename;
  }
}
