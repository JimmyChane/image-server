import { AppEnvService } from '@app/app-env/app-env.service';

export function acquireDatabaseMongodbEnv(appEnvService: AppEnvService) {
  const mongoUri = appEnvService.get('MONGODB_URI');
  if (typeof mongoUri !== 'string') {
    throw new Error('MONGODB_URI is not a string');
  }

  const mongoUriString = mongoUri.trim();
  if (mongoUriString.length === 0) {
    throw new Error('MONGODB_URI is empty');
  }

  return { MONGODB_URI: mongoUriString };
}
