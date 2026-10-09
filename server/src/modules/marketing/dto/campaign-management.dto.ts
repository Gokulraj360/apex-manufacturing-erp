import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
} from 'class-validator';

export enum CampaignTypeEnum {
  DIGITAL_ADS = 'DIGITAL_ADS',
  TRADE_SHOW = 'TRADE_SHOW',
  PRODUCT_LAUNCH = 'PRODUCT_LAUNCH',
  EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
  INDUSTRY_EXPO = 'INDUSTRY_EXPO',
  CONTENT_MARKETING = 'CONTENT_MARKETING',
  PARTNER_ROADSHOW = 'PARTNER_ROADSHOW',
}

export enum CampaignStatusEnum {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CampaignTypeEnum)
  @IsOptional()
  type?: CampaignTypeEnum;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsNotEmpty()
  targetAudience: string;

  @IsNumber()
  @Min(0)
  allocatedBudget: number;

  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsString()
  @IsNotEmpty()
  leadManager: string;
}

export class UpdateCampaignMetricsDto {
  @IsEnum(CampaignStatusEnum)
  @IsOptional()
  status?: CampaignStatusEnum;

  @IsNumber()
  @IsOptional()
  actualSpent?: number;

  @IsNumber()
  @IsOptional()
  impressions?: number;

  @IsNumber()
  @IsOptional()
  clicks?: number;

  @IsNumber()
  @IsOptional()
  leadsGenerated?: number;

  @IsNumber()
  @IsOptional()
  pipelineValueGenerated?: number;

  @IsNumber()
  @IsOptional()
  roiPercentage?: number;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}

export class FeedLeadToCrmDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  contactPerson: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsNumber()
  @Min(0)
  estimatedValue: number;

  @IsDateString()
  @IsNotEmpty()
  expectedCloseDate: string;

  @IsString()
  @IsNotEmpty()
  assignedSalesRep: string;

  @IsString()
  @IsNotEmpty()
  technicalRequirementSummary: string;
}

export class QueryCampaignsDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
