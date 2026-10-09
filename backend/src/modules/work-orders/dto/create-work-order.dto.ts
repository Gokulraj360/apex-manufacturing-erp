import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { Priority, WorkOrderStatus } from '@prisma/client';

export class CreateWorkOrderDto {
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsOptional()
  @IsUUID()
  bomId?: string;

  @IsNumber()
  @IsPositive()
  quantityToProduce: number;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority = Priority.MEDIUM;

  @IsDateString()
  plannedStartDate: string;

  @IsDateString()
  plannedEndDate: string;

  @IsOptional()
  @IsUUID()
  supervisorId?: string;
}

export class UpdateWorkOrderStatusDto {
  @IsEnum(WorkOrderStatus)
  status: WorkOrderStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  quantityProduced?: number;

  @IsOptional()
  @IsNumber()
  quantityScrapped?: number;
}
