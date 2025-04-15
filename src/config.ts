export const ALLOWED_CROSS_ORIGINS: string[] = ['http://localhost:3000'];

export function isProduction(): boolean {
  if (typeof process.env['NODE_ENV'] !== 'string') return true;

  return !['development', 'development '].includes(process.env['NODE_ENV']);
}
