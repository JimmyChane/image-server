export class ImageFormatModel {
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

export const WEBP_IMAGE_FORMAT = new ImageFormatModel('image/webp', 'webp');
export const PNG_IMAGE_FORMAT = new ImageFormatModel('image/png', 'png');
export const JPG_IMAGE_FORMAT = new ImageFormatModel('image/jpg', 'jpg');
export const JPEG_IMAGE_FORMAT = new ImageFormatModel('image/jpeg', 'jpeg');

export const List = [WEBP_IMAGE_FORMAT, PNG_IMAGE_FORMAT, JPG_IMAGE_FORMAT, JPEG_IMAGE_FORMAT];

export function parseMimeTypeToExt(mimetype: string): string {
  for (const format of List) {
    if (format.isSameMimetype(mimetype)) return format.ext;
  }
  throw new Error('file type not supported');
}
