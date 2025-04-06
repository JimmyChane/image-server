export class Dimension {
  width: any = 0;
  height: any = 0;

  constructor(width: any = 0, height: any = 0) {
    width = Number.parseInt(width);
    height = Number.parseInt(height);
    width = !Number.isNaN(width) ? width : 0;
    height = !Number.isNaN(height) ? height : 0;

    if (width > 0) this.width = width;
    if (height > 0) this.height = height;
  }

  isSet(): boolean {
    return this.width > 0 || this.height > 0;
  }
}
