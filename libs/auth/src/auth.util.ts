import { AppEnvService } from '@app/app-env/app-env.service';

export function acquireAuthEnv(appEnvService: AppEnvService) {
  const jwtSecret = appEnvService.get('JWT_SECRET');
  if (typeof jwtSecret !== 'string') {
    throw new Error('JWT_SECRET must be a string');
  }

  const jwtSecretString = jwtSecret.trim();
  if (!jwtSecretString.length) {
    throw new Error('JWT_SECRET must not be empty');
  }

  return { JWT_SECRET: jwtSecretString };
}
