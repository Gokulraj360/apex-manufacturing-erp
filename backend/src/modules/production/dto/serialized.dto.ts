import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsObject,
  Length,
  Matches,
} from 'class-validator';

export enum ProductionStationEnum {
  SMT_LINE = 'SMT_LINE',
  OPTICAL_AOI = 'OPTICAL_AOI',
  SCREWDRIVING = 'SCREWDRIVING',
  RF_ANTENNA = 'RF_ANTENNA',
  BATTERY_SEAL = 'BATTERY_SEAL',
  PACKAGING = 'PACKAGING',
}

export enum SerializedUnitStatusEnum {
  IN_PROCESS = 'IN_PROCESS',
  PASSED = 'PASSED',
  REJECTED = 'REJECTED',
}

export class ScanSerializedUnitDto {
  @IsString()
  @IsNotEmpty()
  @Length(15, 20, { message: 'Serial number / IMEI must be between 15 and 20 alphanumeric characters' })
  @Matches(/^[A-Za-z0-9-]+$/, { message: 'Serial number must contain only alphanumeric characters or hyphens' })
  serialNumber: string;

  @IsEnum(ProductionStationEnum, {
    message:
      'Station must be one of: SMT_LINE, OPTICAL_AOI, SCREWDRIVING, RF_ANTENNA, BATTERY_SEAL, PACKAGING',
  })
  targetStation: ProductionStationEnum;

  @IsString()
  @IsNotEmpty()
  operatorId: string;

  @IsString()
  @IsOptional()
  operatorName?: string;

  @IsEnum(SerializedUnitStatusEnum)
  @IsOptional()
  qcDisposition?: SerializedUnitStatusEnum = SerializedUnitStatusEnum.PASSED;

  @IsString()
  @IsOptional()
  defectReason?: string;

  @IsObject()
  @IsOptional()
  testMetrics?: Record<string, any>;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class QuerySerializedUnitsDto {
  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsEnum(ProductionStationEnum)
  @IsOptional()
  station?: ProductionStationEnum;

  @IsEnum(SerializedUnitStatusEnum)
  @IsOptional()
  status?: SerializedUnitStatusEnum;
}
