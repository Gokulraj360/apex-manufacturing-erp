import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import {
  ServiceRequestType,
  ServicePriority,
  ServiceRequestStatus,
} from '@prisma/client';

export class CreateServiceRequestDto {
  @IsString()
  @IsNotEmpty()
  ticketNumber: string;

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsString()
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsNotEmpty()
  serviceLocation: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(ServiceRequestType)
  @IsOptional()
  requestType?: ServiceRequestType = ServiceRequestType.BREAKDOWN_REPAIR;

  @IsEnum(ServicePriority)
  @IsOptional()
  priority?: ServicePriority = ServicePriority.MEDIUM;

  @IsString()
  @IsOptional()
  machineSerialNumber?: string;

  @IsString()
  @IsNotEmpty()
  machineModel: string;

  @IsString()
  @IsNotEmpty()
  reportedFault: string;

  @IsString()
  @IsOptional()
  amcContractId?: string;

  @IsString()
  @IsOptional()
  warrantyRecordId?: string;

  @IsDateString()
  scheduledDate: string;
}

export class AssignEngineerDto {
  @IsString()
  @IsNotEmpty()
  assignedEngineerId: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;
}

export class UpdateServiceRequestStatusDto {
  @IsEnum(ServiceRequestStatus)
  status: ServiceRequestStatus;

  @IsString()
  @IsOptional()
  resolutionSummary?: string;

  @IsBoolean()
  @IsOptional()
  firstTimeFix?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  customerSatisfactionScore?: number;

  @IsString()
  @IsOptional()
  customerFeedback?: string;

  @IsNumber()
  @IsOptional()
  totalServiceCost?: number;

  @IsDateString()
  @IsOptional()
  completedAt?: string;
}

export class QueryServiceRequestDto {
  @IsOptional()
  @IsEnum(ServiceRequestStatus)
  status?: ServiceRequestStatus;

  @IsOptional()
  @IsEnum(ServicePriority)
  priority?: ServicePriority;

  @IsOptional()
  @IsEnum(ServiceRequestType)
  requestType?: ServiceRequestType;

  @IsOptional()
  @IsString()
  assignedEngineerId?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}
