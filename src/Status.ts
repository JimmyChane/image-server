import ConsoleText from './ConsoleText';
import TimeBuilder from './TimeBuilder';

export default class Status {
  static time() {
    return new Status().time();
  }
  static title(text) {
    return new Status().title(text);
  }
  static state(text) {
    return new Status().state(text);
  }
  static message(text) {
    return new Status().message(text);
  }

  #time: string | undefined = undefined;
  #title = undefined;
  #state = undefined;
  #message = undefined;

  time() {
    this.#time = TimeBuilder.now('-');
    return this;
  }
  title(text) {
    this.#title = text;
    return this;
  }
  state(text) {
    this.#state = text;
    return this;
  }
  message(text) {
    this.#message = text;
    return this;
  }

  log() {
    const contents: string[] = [];

    if (this.#time !== undefined) {
      contents.push(ConsoleText.purple(this.#time));
    }

    if (this.#title !== undefined && this.#state !== undefined) {
      contents.push(`(${ConsoleText.blue(this.#title)}: ${ConsoleText.yellow(this.#state)})`);
    } else if (this.#title !== undefined) {
      contents.push(`(${ConsoleText.blue(this.#title)})`);
    } else if (this.#state !== undefined) {
      contents.push(`(${ConsoleText.yellow(this.#state)})`);
    }

    if (this.#message !== undefined) contents.push(this.#message);

    const str = contents.reduce((str, content, index) => {
      if (index === 0) return `${content}`;
      return `${str} ${content}`;
    }, '');

    console.log(str);
  }
  success() {
    const contents: string[] = [];

    if (this.#time !== undefined) {
      contents.push(ConsoleText.purple(this.#time));
    }

    if (this.#title !== undefined && this.#state !== undefined) {
      contents.push(`(${ConsoleText.blue(this.#title)}: ${ConsoleText.green(this.#state)})`);
    } else if (this.#title !== undefined) {
      contents.push(`(${ConsoleText.blue(this.#title)})`);
    } else if (this.#state !== undefined) {
      contents.push(`(${ConsoleText.green(this.#state)})`);
    }

    if (this.#message !== undefined) contents.push(this.#message);

    const str = contents.reduce((str, content, index) => {
      if (index === 0) return `${content}`;
      return `${str} ${content}`;
    }, '');

    console.log(str);
  }
  error() {
    const contents: string[] = [];

    if (this.#time !== undefined) {
      contents.push(ConsoleText.purple(this.#time));
    }

    if (this.#title !== undefined && this.#state !== undefined) {
      contents.push(`(${ConsoleText.blue(this.#title)}: ${ConsoleText.red(this.#state)})`);
    } else if (this.#title !== undefined) {
      contents.push(`(${ConsoleText.blue(this.#title)})`);
    } else if (this.#state !== undefined) {
      contents.push(`(${ConsoleText.red(this.#state)})`);
    }

    if (this.#message !== undefined) contents.push(this.#message);

    const str = contents.reduce((str, content, index) => {
      if (index === 0) return `${content}`;
      return `${str} ${content}`;
    }, '');

    console.error(str);
  }
}
