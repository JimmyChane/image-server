import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class CacheControlMiddleware implements NestMiddleware {
  private readonly maxAge = 604800;

  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Cache-Control', `public, max-age=${this.maxAge}`);
    next();
  }
}
