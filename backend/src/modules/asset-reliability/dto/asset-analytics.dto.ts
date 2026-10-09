import { AssetCategory } from '@prisma/client';

export class QueryAssetAnalyticsDto {
  assetId?: string;
  category?: AssetCategory;
  facilityLocation?: string;
  timeRange?: '30d' | '90d' | '180d' | '1y';
}

export class LogAssetLifecycleEventDto {
  assetId: string;
  eventType: 'COMMISSIONING' | 'PREVENTIVE_MAINTENANCE' | 'BREAKDOWN_REPAIR' | 'CALIBRATION' | 'RELOCATION' | 'DECOMMISSION';
  eventTitle: string;
  eventDescription: string;
  costIncurred?: number;
  downtimeIncurredMinutes?: number;
  performedBy: string;
}
