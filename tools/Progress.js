const TimeNowGetter = require("./TimeNowGetter.js");

class Progress {
  timeNow = new TimeNowGetter();
  list = [];

  on(key, callback) {
    this.list.push({ time: this.timeNow.get(), key, callback });
    return this;
  }

  call(key, value) {
    const items = this.list.reduce((items, item) => {
      if (item.key === key) items.push(item);
      return items;
    }, []);

    for (const item of items) {
      item.callback(value);
    }

    return this;
  }
}

module.exports = Progress;
