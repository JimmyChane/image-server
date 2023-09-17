module.exports = class ENV {
  static isProduction() {
    return !["development", "development "].includes(process.env.NODE_ENV);
  }
};
