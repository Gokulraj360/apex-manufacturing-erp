import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';

export enum InquiryCategoryEnum {
  ORDER_STATUS = 'ORDER_STATUS',
  TECHNICAL_SPECIFICATION = 'TECHNICAL_SPECIFICATION',
  DRAWING_REVISION = 'DRAWING_REVISION',
  EXPEDITED_DELIVERY = 'EXPEDITED_DELIVERY',
  BILLING_QUERY = 'BILLING_QUERY',
  QUALITY_CONCERN = 'QUALITY_CONCERN',
}

export enum InquiryStatusEnum {
  OPEN = 'OPEN',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum FeedbackSentimentEnum {
  EXCELLENT = 'EXCELLENT',
  SATISFIED = 'SATISFIED',
  NEUTRAL = 'NEUTRAL',
  DISSATISFIED = 'DISSATISFIED',
  ESCALATED = 'ESCALATED',
}

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsOptional()
  salesOrderId?: string;

  @IsEnum(InquiryCategoryEnum)
  category: InquiryCategoryEnum;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsNotEmpty()
  assignedAgent: string;
}

export class ResolveInquiryDto {
  @IsString()
  @IsNotEmpty()
  resolutionNotes: string;

  @IsString()
  @IsNotEmpty()
  resolvedBy: string;
}

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsEnum(FeedbackSentimentEnum)
  sentiment: FeedbackSentimentEnum;

  @IsNumber()
  @Min(1)
  @Max(10)
  npsScore: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  deliveryRating: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  qualityRating: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  communicationRating: number;

  @IsString()
  @IsNotEmpty()
  feedbackComments: string;

  @IsString()
  @IsOptional()
  orderReference?: string;

  @IsString()
  @IsOptional()
  actionTaken?: string;
}
