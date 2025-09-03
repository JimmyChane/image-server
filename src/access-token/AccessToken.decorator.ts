import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { ACCESS_TOKEN_METADATA_KEY } from './AccessToken.interceptor';

export function UrlAccessToken(): CustomDecorator<string> {
  return SetMetadata(ACCESS_TOKEN_METADATA_KEY, {});
}
