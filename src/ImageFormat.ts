export class ImageFormat {
  mimetype: any;
  ext: any;

  constructor(mimetype: string, ext: string) {
    this.mimetype = mimetype;
    this.ext = ext;
  }

  isSameMimetype(mimetype: string) {
    return this.mimetype === mimetype;
  }
  isSameExt(ext: string) {
    return this.ext === ext;
  }
}

export const WEBP = new ImageFormat('image/webp', 'webp');
export const PNG = new ImageFormat('image/png', 'png');
export const JPG = new ImageFormat('image/jpg', 'jpg');
export const JPEG = new ImageFormat('image/jpeg', 'jpeg');

export const List = [WEBP, PNG, JPG, JPEG];

export function parseMimeTypeToExt(mimetype: string) {
  for (const format of List) {
    if (format.isSameMimetype(mimetype)) return format.ext;
  }
  throw new Error('file type not supported');
}
