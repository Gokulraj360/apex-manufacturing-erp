import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ApiErrorResponse } from '../interfaces/api-response.interface';
import { ErrorCode } from '../enums/error-code.enum';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      (request.headers['x-request-id'] as string) ||
      (request as any).requestId ||
      'unknown-request-id';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected internal server error occurred';
    let details: any = null;

    // 1. Handle Custom Application Domain Exceptions
    if (exception instanceof AppException) {
      statusCode = exception.getStatus();
      errorCode = exception.errorCode;
      message = exception.message;
      details = exception.details || null;
    }
    // 2. Handle NestJS Built-in HttpExceptions
    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, any>;
        message = resp.message || exception.message;

        // Class-validator returns an array of string messages on validation failure
        if (Array.isArray(resp.message)) {
          errorCode = ErrorCode.VALIDATION_ERROR;
          message = 'Validation failed on one or more request fields';
          details = resp.message;
        } else {
          errorCode = this.mapHttpStatusToErrorCode(statusCode);
          details = resp.error || null;
        }
      } else {
        message = String(exceptionResponse);
        errorCode = this.mapHttpStatusToErrorCode(statusCode);
      }
    }
    // 3. Handle Prisma Known Request Errors
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaHandled = this.handlePrismaError(exception);
      statusCode = prismaHandled.statusCode;
      errorCode = prismaHandled.errorCode;
      message = prismaHandled.message;
      details = prismaHandled.details;
    }
    // 4. Handle Prisma Validation Errors
    else if (exception instanceof Prisma.PrismaClientValidationError) {
      statusCode = HttpStatus.BAD_REQUEST;
      errorCode = ErrorCode.VALIDATION_ERROR;
      message = 'Database query validation error. Check entity payload format.';
      details = process.env.NODE_ENV !== 'production' ? exception.message : null;
    }
    // 5. Unhandled System Errors
    else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
      message =
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : (exception as Error)?.message || 'Internal server error';
      details =
        process.env.NODE_ENV === 'production'
          ? null
          : (exception as Error)?.stack;
    }

    // Structured logging for debugging & production telemetry
    this.logger.error(
      `[${requestId}] [${errorCode}] ${request.method} ${request.url} - Status: ${statusCode} - ${message}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    const errorResponse: ApiErrorResponse = {
      success: false,
      statusCode,
      errorCode,
      message,
      ...(details ? { details } : {}),
      meta: {
        timestamp: new Date().toISOString(),
        path: request.originalUrl || request.url,
        requestId,
        version: 'v1',
      },
    };

    response.status(statusCode).json(errorResponse);
  }

  private mapHttpStatusToErrorCode(status: HttpStatus): ErrorCode {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.BAD_REQUEST;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.RESOURCE_NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }

  private handlePrismaError(error: Prisma.PrismaClientKnownRequestError): {
    statusCode: HttpStatus;
    errorCode: ErrorCode;
    message: string;
    details: any;
  } {
    switch (error.code) {
      case 'P2002': {
        const target = (error.meta?.target as string[]) || [];
        return {
          statusCode: HttpStatus.CONFLICT,
          errorCode: ErrorCode.DB_UNIQUE_CONSTRAINT_VIOLATION,
          message: `A record with this ${target.join(', ')} already exists in the system.`,
          details: { fields: target },
        };
      }
      case 'P2025': {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          errorCode: ErrorCode.DB_RECORD_NOT_FOUND,
          message: 'The requested record could not be found or has been deleted.',
          details: error.meta,
        };
      }
      case 'P2003': {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: ErrorCode.DB_FOREIGN_KEY_VIOLATION,
          message: 'Foreign key constraint violated: referenced entity does not exist.',
          details: error.meta,
        };
      }
      default:
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          errorCode: ErrorCode.DB_QUERY_FAILURE,
          message: `Database error code ${error.code}`,
          details: process.env.NODE_ENV !== 'production' ? error.meta : null,
        };
    }
  }
}
