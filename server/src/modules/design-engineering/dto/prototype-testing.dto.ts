import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export enum PrototypeTestTypeEnum {
  STRESS_TEST = 'STRESS_TEST',
  THERMAL_CYCLING = 'THERMAL_CYCLING',
  DIMENSIONAL_VERIFICATION = 'DIMENSIONAL_VERIFICATION',
  FATIGUE_TEST = 'FATIGUE_TEST',
  VIBRATION_ANALYSIS = 'VIBRATION_ANALYSIS',
  TORQUE_LOAD_TEST = 'TORQUE_LOAD_TEST',
}

export enum PrototypeTestResultEnum {
  PASSED = 'PASSED',
  CONDITIONAL_PASS = 'CONDITIONAL_PASS',
  FAILED = 'FAILED',
}

export class CreatePrototypeTestLogDto {
  @IsString()
  @IsNotEmpty()
  cadModelId: string;

  @IsString()
  @IsNotEmpty()
  prototypeSerial: string;

  @IsEnum(PrototypeTestTypeEnum)
  @IsOptional()
  testType?: PrototypeTestTypeEnum;

  @IsNotEmpty()
  testParameters: any;

  @IsString()
  @IsNotEmpty()
  observedOutcome: string;

  @IsEnum(PrototypeTestResultEnum)
  @IsOptional()
  result?: PrototypeTestResultEnum;

  @IsNumber()
  @IsOptional()
  maxDeformationMm?: number;

  @IsNumber()
  @IsOptional()
  yieldSafetyFactor?: number;

  @IsString()
  @IsNotEmpty()
  engineerInCharge: string;

  @IsBoolean()
  @IsOptional()
  nextIterationRequired?: boolean;
}

export class QueryPrototypeTestsDto {
  @IsString()
  @IsOptional()
  cadModelId?: string;

  @IsString()
  @IsOptional()
  testType?: string;

  @IsString()
  @IsOptional()
  result?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
