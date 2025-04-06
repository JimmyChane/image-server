export function black(text: string) {
  return new ConsoleText(text).black().toString();
}
export function red(text: string) {
  return new ConsoleText(text).red().toString();
}
export function green(text: string) {
  return new ConsoleText(text).green().toString();
}
export function yellow(text: string) {
  return new ConsoleText(text).yellow().toString();
}
export function blue(text: string) {
  return new ConsoleText(text).blue().toString();
}
export function purple(text: string) {
  return new ConsoleText(text).purple().toString();
}
export function cyan(text: string) {
  return new ConsoleText(text).cyan().toString();
}
export function white(text: string) {
  return new ConsoleText(text).white().toString();
}

export class ConsoleText {
  private text: string;
  private color: string | undefined = undefined;

  constructor(text: string) {
    this.text = text;
  }

  black() {
    this.color = '\u001B[30m';
    return this;
  }
  red() {
    this.color = '\u001B[31m';
    return this;
  }
  green() {
    this.color = '\u001B[32m';
    return this;
  }
  yellow() {
    this.color = '\u001B[33m';
    return this;
  }
  blue() {
    this.color = '\u001B[34m';
    return this;
  }
  purple() {
    this.color = '\u001B[35m';
    return this;
  }
  cyan() {
    this.color = '\u001B[36m';
    return this;
  }
  white() {
    this.color = '\u001B[37m';
    return this;
  }

  toString() {
    if (this.color === undefined) return `${this.text}`;
    return `${this.color}${this.text}${'\u001B[0m'}`;
  }
}
