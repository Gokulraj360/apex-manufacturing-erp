import { ApiResponse, ApiResponseMeta } from '../interfaces/api-response.interface';

export class ApiResponseDto<T> implements ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: ApiResponseMeta;

  constructor(
    data: T,
    message: string = 'Operation completed successfully',
    statusCode: number = 200,
    meta?: Partial<ApiResponseMeta>,
  ) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.meta = {
      timestamp: new Date().toISOString(),
      path: '',
      ...meta,
    };
  }

  static success<T>(
    data: T,
    message = 'Success',
    statusCode = 200,
    meta?: Partial<ApiResponseMeta>,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(data, message, statusCode, meta);
  }
}
