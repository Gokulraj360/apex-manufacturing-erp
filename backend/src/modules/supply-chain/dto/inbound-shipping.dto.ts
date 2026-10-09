import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import {
  TransportMode,
  ShipmentMilestone,
  RiskSeverity,
} from '@prisma/client';

export class CreateInboundShipmentDto {
  @IsString()
  @IsNotEmpty()
  shipmentTrackingNumber: string;

  @IsString()
  @IsOptional()
  poId?: string;

  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsNotEmpty()
  carrierName: string;

  @IsString()
  @IsOptional()
  freightForwarder?: string;

  @IsEnum(TransportMode)
  @IsOptional()
  transportMode?: TransportMode = TransportMode.ROAD;

  @IsString()
  @IsNotEmpty()
  originPortCity: string;

  @IsString()
  @IsNotEmpty()
  destinationPlantCity: string;

  @IsDateString()
  dispatchDate: string;

  @IsDateString()
  estimatedArrivalDate: string;

  @IsString()
  @IsOptional()
  containerOrWaybillNumber?: string;

  @IsString()
  @IsOptional()
  driverOrVesselInfo?: string;

  @IsNumber()
  @IsOptional()
  totalWeightKg?: number;

  @IsNumber()
  @IsOptional()
  estimatedFreightCost?: number;

  @IsEnum(RiskSeverity)
  @IsOptional()
  delayRisk?: RiskSeverity = RiskSeverity.LOW;

  @IsString()
  @IsOptional()
  routeNotes?: string;
}

export class UpdateShipmentMilestoneDto {
  @IsEnum(ShipmentMilestone)
  milestone: ShipmentMilestone;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsEnum(RiskSeverity)
  @IsOptional()
  delayRisk?: RiskSeverity;

  @IsString()
  @IsOptional()
  delayReason?: string;

  @IsDateString()
  @IsOptional()
  actualArrivalDate?: string;
}

export class QueryInboundShipmentDto {
  @IsOptional()
  @IsEnum(ShipmentMilestone)
  milestone?: ShipmentMilestone;

  @IsOptional()
  @IsEnum(TransportMode)
  transportMode?: TransportMode;

  @IsOptional()
  @IsString()
  vendorId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}
