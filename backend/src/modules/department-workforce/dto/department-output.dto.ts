import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export class RecordTargetOutputDto {
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsOptional()
  workstationAssignmentId?: string;

  @IsString()
  @IsNotEmpty()
  workstationOrLine: string; // e.g. 'WS-CNC-04', 'LINE-ASSEMBLY-02'

  @IsString()
  @IsNotEmpty()
  productSku: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsDateString()
  @IsNotEmpty()
  shiftDate: string;

  @IsString()
  @IsOptional()
  shiftCode?: string;

  @IsNumber()
  @Min(1)
  targetQuantity: number;

  @IsNumber()
  @Min(0)
  actualQuantity: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  rejectedQuantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  reworkQuantity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  downtimeMinutes?: number;

  @IsString()
  @IsOptional()
  downtimeReason?: string;

  @IsString()
  @IsOptional()
  supervisorSignoff?: string;

  @IsString()
  @IsOptional()
  recordedBy?: string;
}

export class SignoffOutputDto {
  @IsString()
  @IsNotEmpty()
  supervisorSignoff: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class QueryOutputsDto {
  @IsString()
  @IsOptional()
  departmentId?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  @IsOptional()
  workstationOrLine?: string;

  @IsString()
  @IsOptional()
  shiftDate?: string;

  @IsString()
  @IsOptional()
  shiftCode?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
