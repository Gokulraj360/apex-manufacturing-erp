import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiResponse, ApiResponseMeta, PaginationMeta } from '../interfaces/api-response.interface';
import { RESPONSE_MESSAGE_METADATA_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const startTime = Date.now();
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();
    const response = httpCtx.getResponse<Response>();

    // Retrieve custom message set by @ResponseMessage() decorator
    const customMessage =
      this.reflector.getAllAndOverride<string>(
        RESPONSE_MESSAGE_METADATA_KEY,
        [context.getHandler(), context.getClass()],
      ) || 'Operation completed successfully';

    return next.handle().pipe(
      map((result) => {
        const statusCode = response.statusCode || HttpStatus.OK;
        const durationMs = Date.now() - startTime;
        const requestId =
          (request.headers['x-request-id'] as string) ||
          (request as any).requestId;

        // Check if the result already contains pagination or custom wrapper
        let responseData = result;
        let paginationMeta: PaginationMeta | undefined = undefined;

        if (
          result &&
          typeof result === 'object' &&
          'items' in result &&
          'pagination' in result
        ) {
          responseData = result.items;
          paginationMeta = result.pagination;
        } else if (
          result &&
          typeof result === 'object' &&
          'data' in result &&
          'meta' in result &&
          'success' in result
        ) {
          // Already formatted
          return result;
        }

        const meta: ApiResponseMeta = {
          timestamp: new Date().toISOString(),
          path: request.originalUrl || request.url,
          requestId,
          durationMs,
          ...(paginationMeta ? { pagination: paginationMeta } : {}),
          version: 'v1',
        };

        return {
          success: true,
          statusCode,
          message: customMessage,
          data: responseData !== undefined ? responseData : null,
          meta,
        };
      }),
    );
  }
}
