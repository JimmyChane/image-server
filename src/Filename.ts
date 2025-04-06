function filterName(name = ''): string {
  while (name.indexOf('.') === 0) {
    name = name.substring(1, name.length);
  }
  while (name.lastIndexOf('.') === name.length - 1) {
    name = name.substring(0, name.length - 1);
  }
  return name;
}

export class Filename {
  name = '';
  ext = '';

  constructor(name = '', ext = '') {
    const filename = `${name}.${ext}`;

    const str = filterName(filename);
    const lastIndexDot = str.lastIndexOf('.');

    if (lastIndexDot === -1) {
      this.name = str;
      this.ext = '';
      return;
    }

    this.name = filterName(str.substring(0, lastIndexDot));
    this.ext = str.substring(lastIndexDot + 1, str.length);
  }

  toString(): string {
    return filterName(`${this.name}.${this.ext}`);
  }
  replaceExt(ext = ''): this {
    if (ext.length) {
      this.ext = ext;
    }
    return this;
  }
}
