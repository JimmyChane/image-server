const Progress = require("./Progress");

module.exports = class ImageProgress extends Progress {
  start() {
    return this.call("start");
  }
  chunk(value) {
    return this.call("chunk", value);
  }
  end() {
    return this.call("end");
  }
  close() {
    return this.call("close");
  }
  error(value) {
    return this.call("error", value);
  }

  onStart(callback) {
    return this.on("start", callback);
  }
  onChunk(callback) {
    return this.on("chunk", callback);
  }
  onEnd(callback) {
    return this.on("end", callback);
  }
  onClose(callback) {
    return this.on("close", callback);
  }
  onError(callback) {
    return this.on("error", callback);
  }
};
