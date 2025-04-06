import { blue, green, purple, red, yellow } from './ConsoleText';
import { now } from './TimeBuilder';

export function time() {
  return new Status().time();
}
export function title(text: string) {
  return new Status().title(text);
}
export function state(text: string) {
  return new Status().state(text);
}
export function message(text: string) {
  return new Status().message(text);
}

export class Status {
  private localTime: string | undefined = undefined;
  private localTitle?: string = undefined;
  private localState?: string = undefined;
  private localMessage?: string = undefined;

  time() {
    this.localTime = now('-');
    return this;
  }
  title(text: string) {
    this.localTitle = text;
    return this;
  }
  state(text: string) {
    this.localState = text;
    return this;
  }
  message(text: any) {
    this.localMessage = text;
    return this;
  }

  log() {
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
  success() {
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
  error() {
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
