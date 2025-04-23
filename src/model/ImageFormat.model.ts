export enum ImageFormatId {
  WEBP = 'webp',
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
}

export class ImageFormatModel {
  constructor(
    readonly mimetype: string,
    readonly ext: ImageFormatId,
  ) {}

  isSameMimetype(mimetype: string): boolean {
    return this.mimetype === mimetype;
  }
  isSameExt(ext: string): boolean {
    return this.ext === ext;
  }
}

export const WEBP_IMAGE_FORMAT = new ImageFormatModel('image/webp', ImageFormatId.WEBP);
export const PNG_IMAGE_FORMAT = new ImageFormatModel('image/png', ImageFormatId.PNG);
export const JPG_IMAGE_FORMAT = new ImageFormatModel('image/jpg', ImageFormatId.JPG);
export const JPEG_IMAGE_FORMAT = new ImageFormatModel('image/jpeg', ImageFormatId.JPEG);

export const IMAGE_FORMAT_MAPS: Record<ImageFormatId, ImageFormatModel> = {
  [ImageFormatId.WEBP]: WEBP_IMAGE_FORMAT,
  [ImageFormatId.PNG]: PNG_IMAGE_FORMAT,
  [ImageFormatId.JPG]: JPG_IMAGE_FORMAT,
  [ImageFormatId.JPEG]: JPEG_IMAGE_FORMAT,
};

export const IMAGE_FORMAT_LIST = Object.values(IMAGE_FORMAT_MAPS);

export function parseMimeTypeToExt(mimetype: string): string {
  for (const format of IMAGE_FORMAT_LIST) {
    if (format.isSameMimetype(mimetype)) return format.ext;
  }
  throw new Error('file type not supported');
}
