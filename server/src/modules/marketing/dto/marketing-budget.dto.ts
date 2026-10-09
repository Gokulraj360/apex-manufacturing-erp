import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';

export enum BudgetApprovalStatusEnum {
  DRAFT = 'DRAFT',
  SUBMITTED_TO_ACCOUNTS = 'SUBMITTED_TO_ACCOUNTS',
  ACCOUNTS_APPROVED = 'ACCOUNTS_APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
}

export class CreateAdvertisingBudgetDto {
  @IsString()
  @IsOptional()
  campaignId?: string;

  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsString()
  @IsNotEmpty()
  category: string; // 'EXPO_STALL', 'DIGITAL_MEDIA_BUY', 'BROCHURE_PRINTING', 'SPONSORSHIP'

  @IsNumber()
  @Min(0)
  proposedAmount: number;

  @IsString()
  @IsNotEmpty()
  vendorOrPlatform: string;

  @IsString()
  @IsNotEmpty()
  requestedBy: string;

  @IsString()
  @IsOptional()
  justification?: string;
}

export class ApproveBudgetByFinanceDto {
  @IsEnum(BudgetApprovalStatusEnum)
  @IsNotEmpty()
  approvalStatus: BudgetApprovalStatusEnum;

  @IsNumber()
  @IsOptional()
  approvedAmount?: number;

  @IsString()
  @IsNotEmpty()
  approvedByFinance: string;

  @IsString()
  @IsOptional()
  journalEntryRef?: string; // Accounts finance link
}

export class QueryBudgetsDto {
  @IsString()
  @IsOptional()
  campaignId?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  approvalStatus?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
