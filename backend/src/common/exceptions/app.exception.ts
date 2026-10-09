import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../enums/error-code.enum';

export class AppException extends HttpException {
  public readonly errorCode: ErrorCode;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    errorCode: ErrorCode = ErrorCode.BAD_REQUEST,
    details?: any,
  ) {
    super(
      {
        message,
        errorCode,
        details,
      },
      statusCode,
    );
    this.errorCode = errorCode;
    this.details = details;
  }
}

export class ResourceNotFoundException extends AppException {
  constructor(resource: string, identifier?: string | number) {
    const msg = identifier
      ? `${resource} with identifier '${identifier}' was not found.`
      : `${resource} not found.`;
    super(msg, HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND);
  }
}

export class InsufficientInventoryException extends AppException {
  constructor(sku: string, required: number, available: number) {
    super(
      `Insufficient inventory for item '${sku}'. Required: ${required}, Available: ${available}`,
      HttpStatus.UNPROCESSABLE_ENTITY,
      ErrorCode.INSUFFICIENT_INVENTORY,
      { sku, required, available },
    );
  }
}

export class InvalidWorkOrderStatusTransitionException extends AppException {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      `Cannot transition work order from status '${currentStatus}' to '${targetStatus}'.`,
      HttpStatus.CONFLICT,
      ErrorCode.INVALID_WORK_ORDER_STATUS,
      { currentStatus, targetStatus },
    );
  }
}
