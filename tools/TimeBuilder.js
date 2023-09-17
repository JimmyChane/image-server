module.exports = class TimeBuilder {
  static #toString(time) {
    time = time.toString();
    return time.length == 1 ? `0${time}` : time;
  }
  static getCurrent(separator = "") {
    const now = new Date();

    const year = now.getUTCFullYear();
    const month = this.#toString(now.getUTCMonth() + 1);
    const date = this.#toString(now.getUTCDate());
    const hour = this.#toString(now.getUTCHours() + 1);
    const minute = this.#toString(now.getUTCMinutes() + 1);
    const second = this.#toString(now.getUTCSeconds() + 1);

    return `${year}${separator}${month}${separator}${date}${separator}${hour}${separator}${minute}${separator}${second}`;
  }
  static now(separator = "") {
    const now = new Date();

    const year = now.getFullYear(); // xxxx
    const month = this.#toString(now.getMonth() + 1); // 0 - 11
    const date = this.#toString(now.getDate()); // 1 - 31
    const hour = this.#toString(now.getHours()); // 0 - 23
    const minute = this.#toString(now.getMinutes()); // 0 - 59
    const second = this.#toString(now.getSeconds()); // 0 - 59

    return `${year}${month}${date}${separator}${hour}${minute}${second}`;
  }
};
