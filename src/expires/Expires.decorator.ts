import { SetMetadata } from '@nestjs/common';

import { EXPIRES_METADATA_KEY, ExpiresOption } from './Expires.interceptor';

export const Expires = (value: ExpiresOption) => {
  return SetMetadata(EXPIRES_METADATA_KEY, value);
};
