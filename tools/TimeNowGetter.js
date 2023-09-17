class TimeNowGetter {
  #last = 0;

  get() {
    let now = Date.now();

    while (this.#last >= now) now++;

    this.#last = now;
    return now;
  }
}

module.exports = TimeNowGetter;
