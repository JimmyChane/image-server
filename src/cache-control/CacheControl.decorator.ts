import { SetMetadata } from '@nestjs/common';

import {
  CACHE_CONTROL_METADATA_KEY,
  CacheControlOption,
} from '@/cache-control/CacheControl.interceptor';

export const CacheControl = (options: CacheControlOption) => {
  return SetMetadata(CACHE_CONTROL_METADATA_KEY, options);
};
