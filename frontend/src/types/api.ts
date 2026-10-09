export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponseMeta {
  timestamp: string;
  path: string;
  requestId?: string;
  pagination?: PaginationMeta;
}

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | string[];
  details?: Record<string, any>;
  timestamp: string;
  path: string;
  requestId?: string;
}

export type Role =
  | 'SUPER_ADMIN'
  | 'PLANT_MANAGER'
  | 'PRODUCTION_SUPERVISOR'
  | 'OPERATOR'
  | 'QUALITY_INSPECTOR'
  | 'INVENTORY_CONTROLLER'
  | 'MAINTENANCE_ENGINEER';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  department?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResponse extends AuthTokens {
  user: UserProfile;
}
