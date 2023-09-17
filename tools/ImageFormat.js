module.exports = class ImageFormat {
  static WEBP = new ImageFormat("image/webp", "webp");
  static PNG = new ImageFormat("image/png", "png");
  static JPG = new ImageFormat("image/jpg", "jpg");
  static JPEG = new ImageFormat("image/jpeg", "jpeg");

  static List = [
    ImageFormat.WEBP,
    ImageFormat.PNG,
    ImageFormat.JPG,
    ImageFormat.JPEG,
  ];

  static parseMimeTypeToExt(mimetype) {
    for (const format of ImageFormat.List) {
      if (format.isSameMimetype(mimetype)) return format.ext;
    }
    throw new Error("file type not supported");
  }

  constructor(mimetype, ext) {
    this.mimetype = mimetype;
    this.ext = ext;
  }

  isSameMimetype(mimetype) {
    return this.mimetype === mimetype;
  }
  isSameExt(ext) {
    return this.ext === ext;
  }
};
