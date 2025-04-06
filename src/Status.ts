import { blue, green, purple, red, yellow } from './ConsoleText';
import { now } from './TimeBuilder';

export function time(): Status {
  return new Status().time();
}
export function title(text: string): Status {
  return new Status().title(text);
}
export function state(text: string): Status {
  return new Status().state(text);
}
export function message(text: string): Status {
  return new Status().message(text);
}

export class Status {
  private localTime: string | undefined = undefined;
  private localTitle?: string = undefined;
  private localState?: string = undefined;
  private localMessage?: string = undefined;

  time(): this {
    this.localTime = now('-');
    return this;
  }
  title(text: string): this {
    this.localTitle = text;
    return this;
  }
  state(text: string): this {
    this.localState = text;
    return this;
  }
  message(text: any): this {
    this.localMessage = text;
    return this;
  }

  log(): void {
    const contents: string[] = [];

    if (this.localTime !== undefined) {
      contents.push(purple(this.localTime));
    }

    if (this.localTitle !== undefined && this.localState !== undefined) {
      contents.push(`(${blue(this.localTitle)}: ${yellow(this.localState)})`);
    } else if (this.localTitle !== undefined) {
      contents.push(`(${blue(this.localTitle)})`);
    } else if (this.localState !== undefined) {
      contents.push(`(${yellow(this.localState)})`);
    }

    if (this.localMessage !== undefined) contents.push(this.localMessage);

    const str = contents.reduce((str, content, index) => {
      if (index === 0) return `${content}`;
      return `${str} ${content}`;
    }, '');

    console.log(str);
  }
  success(): void {
    const contents: string[] = [];

    if (this.localTime !== undefined) {
      contents.push(purple(this.localTime));
    }

    if (this.localTitle !== undefined && this.localState !== undefined) {
      contents.push(`(${blue(this.localTitle)}: ${green(this.localState)})`);
    } else if (this.localTitle !== undefined) {
      contents.push(`(${blue(this.localTitle)})`);
    } else if (this.localState !== undefined) {
      contents.push(`(${green(this.localState)})`);
    }

    if (this.localMessage !== undefined) contents.push(this.localMessage);

    const str = contents.reduce((str, content, index) => {
      if (index === 0) return `${content}`;
      return `${str} ${content}`;
    }, '');

    console.log(str);
  }
  error(): void {
    const contents: string[] = [];

    if (this.localTime !== undefined) {
      contents.push(purple(this.localTime));
    }

    if (this.localTitle !== undefined && this.localState !== undefined) {
      contents.push(`(${blue(this.localTitle)}: ${red(this.localState)})`);
    } else if (this.localTitle !== undefined) {
      contents.push(`(${blue(this.localTitle)})`);
    } else if (this.localState !== undefined) {
      contents.push(`(${red(this.localState)})`);
    }

    if (this.localMessage !== undefined) contents.push(this.localMessage);

    const str = contents.reduce((str, content, index) => {
      if (index === 0) return `${content}`;
      return `${str} ${content}`;
    }, '');

    console.error(str);
  }
}
