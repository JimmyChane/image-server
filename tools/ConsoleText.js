module.exports = class ConsoleText {
  static black(text) {
    return new ConsoleText(text).black().toString();
  }
  static red(text) {
    return new ConsoleText(text).red().toString();
  }
  static green(text) {
    return new ConsoleText(text).green().toString();
  }
  static yellow(text) {
    return new ConsoleText(text).yellow().toString();
  }
  static blue(text) {
    return new ConsoleText(text).blue().toString();
  }
  static purple(text) {
    return new ConsoleText(text).purple().toString();
  }
  static cyan(text) {
    return new ConsoleText(text).cyan().toString();
  }
  static white(text) {
    return new ConsoleText(text).white().toString();
  }

  #text;
  #color = undefined;

  constructor(text) {
    this.#text = text;
  }

  black() {
    this.#color = "\u001B[30m";
    return this;
  }
  red() {
    this.#color = "\u001B[31m";
    return this;
  }
  green() {
    this.#color = "\u001B[32m";
    return this;
  }
  yellow() {
    this.#color = "\u001B[33m";
    return this;
  }
  blue() {
    this.#color = "\u001B[34m";
    return this;
  }
  purple() {
    this.#color = "\u001B[35m";
    return this;
  }
  cyan() {
    this.#color = "\u001B[36m";
    return this;
  }
  white() {
    this.#color = "\u001B[37m";
    return this;
  }

  toString() {
    if (this.#color === undefined) return `${this.#text}`;
    return `${this.#color}${this.#text}${"\u001B[0m"}`;
  }
};
