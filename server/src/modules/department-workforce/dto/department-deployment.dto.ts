import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export enum WorkstationRoleEnum {
  PRIMARY_OPERATOR = 'PRIMARY_OPERATOR',
  ASSISTANT_OPERATOR = 'ASSISTANT_OPERATOR',
  LINE_LEAD = 'LINE_LEAD',
  QUALITY_CHECKER = 'QUALITY_CHECKER',
  MAINTENANCE_TECH = 'MAINTENANCE_TECH',
  TRAINEE = 'TRAINEE',
}

export enum DeploymentStatusEnum {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  REASSIGNED = 'REASSIGNED',
  STANDBY = 'STANDBY',
  CANCELLED = 'CANCELLED',
}

export class CreateWorkstationAssignmentDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @IsString()
  @IsNotEmpty()
  stationIdentifier: string; // e.g. 'WS-CNC-04', 'LINE-ASSEMBLY-02', 'WELD-CELL-01'

  @IsString()
  @IsOptional()
  machineAssetId?: string;

  @IsString()
  @IsOptional()
  shiftCode?: string; // SHIFT_A, SHIFT_B, SHIFT_C

  @IsDateString()
  @IsNotEmpty()
  assignmentDate: string;

  @IsEnum(WorkstationRoleEnum)
  @IsOptional()
  roleOnStation?: WorkstationRoleEnum;

  @IsBoolean()
  @IsOptional()
  certificationVerified?: boolean;

  @IsString()
  @IsOptional()
  supervisorRemarks?: string;

  @IsString()
  @IsOptional()
  assignedBy?: string;
}

export class UpdateDeploymentStatusDto {
  @IsEnum(DeploymentStatusEnum)
  @IsNotEmpty()
  status: DeploymentStatusEnum;

  @IsString()
  @IsOptional()
  reassignedStationIdentifier?: string;

  @IsString()
  @IsOptional()
  supervisorRemarks?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}

export class QueryDeploymentsDto {
  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  stationIdentifier?: string;

  @IsString()
  @IsOptional()
  shiftCode?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
