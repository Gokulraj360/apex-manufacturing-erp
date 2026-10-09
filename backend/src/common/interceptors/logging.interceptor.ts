import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const requestId = req.headers['x-request-id'] || 'no-id';
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const { statusCode } = res;
        const duration = Date.now() - startTime;
        this.logger.log(
          `[${requestId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip} "${userAgent}"`,
        );
      }),
    );
  }
}
