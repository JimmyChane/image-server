export function optCacheControlString(x?: string): string {
  if (typeof x !== 'string') return '';
  while (x.includes(' ')) x = x.replace(' ', '');
  return x;
}

export class CacheControl {
  private readonly contents: any[] = [];

  public() {
    return this.on('public');
  }
  private() {
    return this.on('private');
  }

  noCache() {
    return this.on('no-cache');
  }
  noStore() {
    return this.on('no-store');
  }
  noTransform() {
    return this.on('no-transform');
  }

  maxAge(time: string) {
    return this.on('max-age', time).on('s-maxage', time);
  }
  maxStale(time: string) {
    return this.on('max-stale', time);
  }
  minFresh(time: string) {
    return this.on('min-fresh', time);
  }

  mustRevalidate() {
    return this.on('must-revalidate');
  }
  mustUnderstand() {
    return this.on('must-understand');
  }

  immutable() {
    return this.on('immutable');
  }
  staleWhileRevalidate() {
    return this.on('stale-while-revalidate');
  }
  staleIfError() {
    return this.on('stale-if-error');
  }

  on(key = '', value: string | undefined = undefined) {
    key = optCacheControlString(key);
    if (key.length === 0) return this;

    value = optCacheControlString(value);

    const content = this.contents.find((content) => content.key === key);
    if (content) this.contents.splice(this.contents.indexOf(content), 1);

    value === '' ? this.contents.push({ key }) : this.contents.push({ key, value });

    return this;
  }

  toString() {
    if (!this.contents.length) return;

    return this.contents.reduce((str, config) => {
      let { key, value } = config;
      value = value === undefined ? '' : `=${value}`;
      if (str.length) str = `${str}, `;
      return `${str}${key}${value}`;
    }, '');
  }
}
