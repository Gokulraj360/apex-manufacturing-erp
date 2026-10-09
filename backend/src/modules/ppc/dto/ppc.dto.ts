import { Type } from 'class-transformer';
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
import { PaginationDto } from '../../../common/dto/pagination.dto';

export enum MPSStatus {
  PLANNED = 'PLANNED',
  RELEASED = 'RELEASED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PRStatus {
  AUTO_GENERATED = 'AUTO_GENERATED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PO_CREATED = 'PO_CREATED',
  REJECTED = 'REJECTED',
}

export class CreateMPSDto {
  @IsString()
  @IsNotEmpty()
  planNumber: string;

  @IsOptional()
  @IsUUID()
  salesOrderId?: string;

  @IsUUID()
  @IsNotEmpty()
  finishedItemId: string;

  @IsOptional()
  @IsUUID()
  bomId?: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  plannedQty: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsString()
  priority?: string = 'MEDIUM';

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateMPSStatusDto {
  @IsEnum(MPSStatus)
  status: MPSStatus;
}

export class QueryMPSDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MPSStatus)
  status?: MPSStatus;
}
