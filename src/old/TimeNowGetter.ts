export class TimeNowGetter {
  private last = 0;

  get(): number {
    let now = Date.now();

    while (this.last >= now) now++;

    this.last = now;
    return now;
  }
}
