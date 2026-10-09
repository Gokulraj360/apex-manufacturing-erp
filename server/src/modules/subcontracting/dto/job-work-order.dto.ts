import {
  SubcontractProcessType,
  JobWorkStatus,
} from '@prisma/client';

export class CreateSubcontractorVendorDto {
  vendorCode: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  gstinTaxId?: string;
  specializedProcesses: string[];
}

export class CreateJobWorkOrderDto {
  orderNumber?: string;
  vendorId: string;
  processType: SubcontractProcessType;
  processDescription: string;
  targetProductPart: string;
  inputItemSku: string;
  outputItemSku: string;
  targetQuantity: number;
  scrapAllowancePercent?: number;
  unitProcessingRate: number;
  expectedDeliveryDate: string | Date;
  notes?: string;
}

export class UpdateJobWorkOrderDto {
  processDescription?: string;
  targetQuantity?: number;
  unitProcessingRate?: number;
  status?: JobWorkStatus;
  expectedDeliveryDate?: string | Date;
  notes?: string;
}

export class QueryJobWorkOrderDto {
  vendorId?: string;
  status?: JobWorkStatus;
  processType?: SubcontractProcessType;
  search?: string;
}
