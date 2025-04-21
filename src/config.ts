export function isProduction(): boolean {
  if (typeof process.env['NODE_ENV'] !== 'string') return true;

  switch (process.env['NODE_ENV']) {
    case 'development':
      return false;
    case 'production':
      return true;
    default:
      throw new Error('NODE_ENV is not defined');
  }
}
