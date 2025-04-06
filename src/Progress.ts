import { TimeNowGetter } from './TimeNowGetter';

export class Progress {
  timeNow = new TimeNowGetter();
  list: { time: number; key: string; callback: Function }[] = [];

  on(key: string, callback: any) {
    this.list.push({ time: this.timeNow.get(), key, callback });
    return this;
  }

  call(key: string, value: any) {
    const items = this.list.reduce((items: any[], item) => {
      if (item.key === key) items.push(item);
      return items;
    }, []);

    for (const item of items) {
      item.callback(value);
    }

    return this;
  }
}
