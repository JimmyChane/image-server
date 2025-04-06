import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';

export const EXPIRES_METADATA_KEY = 'expires';

export type ExpiresOption = number;

@Injectable()
export class ExpiresInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handlerOptions = this.reflector.get<ExpiresOption | undefined>(
      EXPIRES_METADATA_KEY,
      context.getHandler(),
    );

    const classOptions = this.reflector.get<ExpiresOption | undefined>(
      EXPIRES_METADATA_KEY,
      context.getClass(),
    );

    const mergedOptions: ExpiresOption | undefined = classOptions ?? handlerOptions;

    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        if (typeof mergedOptions !== 'number') return;
        response.setHeader('Expires', mergedOptions);
      }),
    );
  }
}
