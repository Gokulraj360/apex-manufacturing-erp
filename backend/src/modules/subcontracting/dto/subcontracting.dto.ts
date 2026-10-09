import { IsOptional, IsString, IsEnum, IsNumber, Min } from 'class-validator';

export enum SubcontractStatusEnum {
  TOLERANCE_APPROVED = 'TOLERANCE_APPROVED',
  SHORTAGE_PENALTY = 'SHORTAGE_PENALTY',
  SETTLED = 'SETTLED',
}

export class QuerySubcontractChallansDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SubcontractStatusEnum)
  status?: SubcontractStatusEnum;

  @IsOptional()
  @IsString()
  vendorName?: string;
}

export class SettleChallanDto {
  @IsOptional()
  @IsString()
  settlementNotes?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  waivePenaltyAmount?: number;

  @IsOptional()
  @IsString()
  authorizedBy?: string;
}
