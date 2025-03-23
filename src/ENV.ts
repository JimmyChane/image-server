export default class ENV {
  static isProduction() {
    if (typeof process.env.NODE_ENV !== 'string') return true;

    return !['development', 'development '].includes(process.env.NODE_ENV);
  }
}
