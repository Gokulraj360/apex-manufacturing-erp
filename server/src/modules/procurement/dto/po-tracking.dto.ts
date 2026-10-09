import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ProcurementPOStatusEnum } from './purchase-order.dto';

export class UpdatePODeliveryScheduleDto {
  @IsString()
  @IsNotEmpty()
  newPromisedDeliveryDate: string;

  @IsString()
  @IsNotEmpty()
  reasonForAdjustment: string;

  @IsString()
  @IsNotEmpty()
  modifiedBy: string;
}

export class ModifyPOItemsDto {
  @IsString()
  @IsNotEmpty()
  modifiedBy: string;

  @IsString()
  @IsNotEmpty()
  reasonForModification: string;

  items: {
    itemSku: string;
    itemName: string;
    orderedQty: number;
    receivedQty?: number;
    unitPrice: number;
    discountPct?: number;
    lineTotal: number;
    targetDate?: string;
  }[];
}

export class SendDeliveryReminderDto {
  @IsString()
  @IsNotEmpty()
  senderName: string;

  @IsString()
  @IsOptional()
  customMessage?: string;
}

export class UpdatePOStatusDto {
  @IsEnum(ProcurementPOStatusEnum)
  status: ProcurementPOStatusEnum;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  actualDeliveryDate?: string;
}
