import {
  AssetCategory,
  AssetStatus,
  AssetCriticality,
} from '@prisma/client';

export class CreateMachineAssetDto {
  assetTag: string;
  assetName: string;
  category: AssetCategory;
  serialNumber: string;
  modelNumber: string;
  manufacturer: string;
  facilityLocation: string;
  powerRatingKw?: number;
  operatingVoltage?: string;
  installationDate: string | Date;
  warrantyExpiryDate?: string | Date;
  criticality?: AssetCriticality;
  manualDocumentUrl?: string;
  specifications?: Record<string, any>;
}

export class UpdateMachineAssetDto {
  assetName?: string;
  category?: AssetCategory;
  serialNumber?: string;
  modelNumber?: string;
  manufacturer?: string;
  facilityLocation?: string;
  powerRatingKw?: number;
  operatingVoltage?: string;
  warrantyExpiryDate?: string | Date;
  status?: AssetStatus;
  criticality?: AssetCriticality;
  totalOperatingHours?: number;
  mtbfHours?: number;
  mttrHours?: number;
  manualDocumentUrl?: string;
  specifications?: Record<string, any>;
}

export class QueryMachineAssetDto {
  category?: AssetCategory;
  status?: AssetStatus;
  facilityLocation?: string;
  criticality?: AssetCriticality;
  search?: string;
}
