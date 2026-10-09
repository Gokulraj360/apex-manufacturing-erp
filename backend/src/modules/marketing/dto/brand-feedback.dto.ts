import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';

export enum SurveyTargetAudienceEnum {
  OEM_CLIENTS = 'OEM_CLIENTS',
  TIER_1_SUPPLIERS = 'TIER_1_SUPPLIERS',
  DISTRIBUTORS = 'DISTRIBUTORS',
  PUBLIC_INDUSTRY = 'PUBLIC_INDUSTRY',
}

export enum SurveyStatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export class CreateCustomerSurveyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(SurveyTargetAudienceEnum)
  @IsOptional()
  targetAudience?: SurveyTargetAudienceEnum;

  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsArray()
  @IsNotEmpty()
  questions: any[];

  @IsString()
  @IsNotEmpty()
  publishedBy: string;
}

export class RecordSurveyResponseDto {
  @IsString()
  @IsNotEmpty()
  surveyId: string;

  @IsString()
  @IsOptional()
  respondentCompany?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  csatRating: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  brandPerceptionRating: number;

  @IsString()
  @IsOptional()
  feedbackText?: string;

  @IsArray()
  @IsOptional()
  keyStrengths?: string[];

  @IsArray()
  @IsOptional()
  improvementAreas?: string[];
}

export class QuerySurveysDto {
  @IsString()
  @IsOptional()
  targetAudience?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
