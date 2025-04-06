export class ImageFormat {
  constructor(
    readonly mimetype: string,
    readonly ext: string,
  ) {}

  isSameMimetype(mimetype: string): boolean {
    return this.mimetype === mimetype;
  }
  isSameExt(ext: string): boolean {
    return this.ext === ext;
  }
}

export const WEBP = new ImageFormat('image/webp', 'webp');
export const PNG = new ImageFormat('image/png', 'png');
export const JPG = new ImageFormat('image/jpg', 'jpg');
export const JPEG = new ImageFormat('image/jpeg', 'jpeg');

export const List = [WEBP, PNG, JPG, JPEG];

export function parseMimeTypeToExt(mimetype: string): string {
  for (const format of List) {
    if (format.isSameMimetype(mimetype)) return format.ext;
  }
  throw new Error('file type not supported');
}
