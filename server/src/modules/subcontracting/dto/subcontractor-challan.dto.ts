import {
  SubcontractChallanType,
  SubcontractChallanStatus,
} from '@prisma/client';

export class ChallanItemDto {
  itemSku: string;
  description: string;
  quantity: number;
  uom: string;
  unitRate: number;
  totalValue: number;
}

export class CreateSubcontractorChallanDto {
  challanNumber?: string;
  challanType: SubcontractChallanType;
  jobWorkOrderId: string;
  vendorId: string;
  dispatchDate?: string | Date;
  expectedReturnDate?: string | Date;
  vehicleNumber?: string;
  transporterName?: string;
  driverContact?: string;
  eWayBillNumber?: string;
  items: ChallanItemDto[];
  notes?: string;
}

export class UpdateChallanStatusDto {
  status: SubcontractChallanStatus;
  notes?: string;
}

export class QueryChallanDto {
  jobWorkOrderId?: string;
  vendorId?: string;
  status?: SubcontractChallanStatus;
  challanType?: SubcontractChallanType;
  search?: string;
}
