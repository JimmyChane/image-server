import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { EXPIRES_METADATA_KEY, ExpiresOption } from './expires.interceptor';

export function Expires(value: ExpiresOption): CustomDecorator<string> {
  return SetMetadata(EXPIRES_METADATA_KEY, value);
}
