import { Controller, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from './access-token/access-token.guard';

@Controller()
@UseGuards(AccessTokenGuard)
export class AppController {
  constructor() {}
}
