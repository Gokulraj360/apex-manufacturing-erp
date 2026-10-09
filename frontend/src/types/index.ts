export type UserRole =
  | 'SUPER_ADMIN'
  | 'PLANT_MANAGER'
  | 'PRODUCTION_SUPERVISOR'
  | 'INVENTORY_MANAGER'
  | 'QUALITY_INSPECTOR'
  | 'OPERATOR'
  | 'MAINTENANCE_TECH';

export type WorkOrderStatus =
  | 'DRAFT'
  | 'PLANNED'
  | 'RELEASED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ItemCategory =
  | 'RAW_MATERIAL'
  | 'WORK_IN_PROGRESS'
  | 'FINISHED_GOODS'
  | 'PACKAGING'
  | 'SPARE_PARTS';

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponseMeta {
  timestamp: string;
  path: string;
  requestId?: string;
  durationMs?: number;
  pagination?: PaginationMeta;
  version?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta: ApiResponseMeta;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: ItemCategory;
  unit: string;
  unitCost: number;
  currentStock: number;
  minimumStock: number;
  safetyStock: number;
  reorderPoint: number;
  location?: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  description?: string;
  productId: string;
  product?: InventoryItem;
  quantityToProduce: number;
  quantityProduced: number;
  quantityScrapped: number;
  status: WorkOrderStatus;
  priority: Priority;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
}
