export function optCacheControlString(x?: string): string {
  if (typeof x !== 'string') return '';
  while (x.includes(' ')) x = x.replace(' ', '');
  return x;
}

export class CacheControl {
  private readonly contents: any[] = [];

  public(): this {
    return this.on('public');
  }
  private(): this {
    return this.on('private');
  }

  noCache(): this {
    return this.on('no-cache');
  }
  noStore(): this {
    return this.on('no-store');
  }
  noTransform(): this {
    return this.on('no-transform');
  }

  maxAge(time: string): this {
    return this.on('max-age', time).on('s-maxage', time);
  }
  maxStale(time: string): this {
    return this.on('max-stale', time);
  }
  minFresh(time: string): this {
    return this.on('min-fresh', time);
  }

  mustRevalidate(): this {
    return this.on('must-revalidate');
  }
  mustUnderstand(): this {
    return this.on('must-understand');
  }

  immutable(): this {
    return this.on('immutable');
  }
  staleWhileRevalidate(): this {
    return this.on('stale-while-revalidate');
  }
  staleIfError(): this {
    return this.on('stale-if-error');
  }

  on(key = '', value: string | undefined = undefined): this {
    key = optCacheControlString(key);
    if (key.length === 0) return this;

    value = optCacheControlString(value);

    const content = this.contents.find((content) => content.key === key);
    if (content) this.contents.splice(this.contents.indexOf(content), 1);

    value === '' ? this.contents.push({ key }) : this.contents.push({ key, value });

    return this;
  }

  toString(): string {
    if (!this.contents.length) return '';

    return this.contents.reduce((str: string, config) => {
      let { key, value } = config;
      value = value === undefined ? '' : `=${value}`;
      if (str.length) str = `${str}, `;
      return `${str}${key}${value}`;
    }, '');
  }
}
