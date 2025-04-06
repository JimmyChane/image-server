function toTimeBuilderString(time: string | number) {
  time = time.toString();
  return time.length == 1 ? `0${time}` : time;
}

export function getCurrent(separator = '') {
  const now = new Date();

  const year = now.getUTCFullYear();
  const month = toTimeBuilderString(now.getUTCMonth() + 1);
  const date = toTimeBuilderString(now.getUTCDate());
  const hour = toTimeBuilderString(now.getUTCHours() + 1);
  const minute = toTimeBuilderString(now.getUTCMinutes() + 1);
  const second = toTimeBuilderString(now.getUTCSeconds() + 1);

  return `${year}${separator}${month}${separator}${date}${separator}${hour}${separator}${minute}${separator}${second}`;
}
export function now(separator = ''): string {
  const now = new Date();

  const year = now.getFullYear(); // xxxx
  const month = toTimeBuilderString(now.getMonth() + 1); // 0 - 11
  const date = toTimeBuilderString(now.getDate()); // 1 - 31
  const hour = toTimeBuilderString(now.getHours()); // 0 - 23
  const minute = toTimeBuilderString(now.getMinutes()); // 0 - 59
  const second = toTimeBuilderString(now.getSeconds()); // 0 - 59

  return `${year}${month}${date}${separator}${hour}${minute}${second}`;
}
