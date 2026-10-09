export type CampaignType =
  | 'DIGITAL_ADS'
  | 'TRADE_SHOW'
  | 'WEBINAR'
  | 'EMAIL_NURTURE'
  | 'PARTNER_EXPO'
  | 'DIRECT_MAIL';

export type CampaignStatus =
  | 'PLANNING'
  | 'ACTIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED';

export type DigitalAssetType =
  | 'PRODUCT_BROCHURE'
  | 'TECH_SPEC_SHEET'
  | 'CAD_CATALOG'
  | 'PROMOTIONAL_VIDEO'
  | 'CASE_STUDY'
  | 'BRAND_ASSET';

export type TrendImpactLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type BudgetApprovalStatus =
  | 'DRAFT'
  | 'SUBMITTED_TO_ACCOUNTS'
  | 'ACCOUNTS_APPROVED'
  | 'REJECTED'
  | 'DISBURSED';

export type SurveyTargetAudience =
  | 'OEM_CLIENTS'
  | 'TIER_1_SUPPLIERS'
  | 'DISTRIBUTORS'
  | 'PUBLIC_INDUSTRY';

export type SurveyStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface MarketingCampaignItem {
  id: string;
  campaignCode: string;
  name: string;
  description?: string | null;
  type: CampaignType;
  status: CampaignStatus;
  startDate: string;
  endDate?: string | null;
  targetAudience: string;
  allocatedBudget: number;
  actualSpent: number;
  impressions: number;
  clicks: number;
  leadsGenerated: number;
  pipelineValueGenerated: number;
  roiPercentage?: number | null;
  channel: string;
  leadManager: string;
  leads?: Array<{
    id: string;
    leadNumber: string;
    title: string;
    companyName: string;
    estimatedValue: number;
    stage: string;
  }>;
  digitalAssets?: Array<{
    id: string;
    assetCode: string;
    title: string;
    type: string;
  }>;
  budgets?: Array<{
    id: string;
    budgetId: string;
    eventName: string;
    proposedAmount: number;
    approvalStatus: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalAssetItem {
  id: string;
  assetCode: string;
  title: string;
  description?: string | null;
  type: DigitalAssetType;
  fileUrl: string;
  fileSizeBytes: number;
  mimeType: string;
  version: string;
  isPublic: boolean;
  partnerAccessAllowed: boolean;
  downloadCount: number;
  campaignId?: string | null;
  campaign?: {
    id: string;
    campaignCode: string;
    name: string;
    type: string;
  } | null;
  tags: string[];
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorMarketTrendItem {
  id: string;
  trendCode: string;
  competitorName: string;
  marketSegment: string;
  observedPricePerUnit?: number | null;
  ourComparablePrice?: number | null;
  priceVariancePct?: number | null;
  demandIndex: number;
  impactLevel: TrendImpactLevel;
  marketObservations: string;
  recommendedStrategy?: string | null;
  recordedBy: string;
  observedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertisingBudgetItem {
  id: string;
  budgetId: string;
  campaignId?: string | null;
  campaign?: {
    id: string;
    campaignCode: string;
    name: string;
    type: string;
    allocatedBudget: number;
    actualSpent: number;
  } | null;
  eventName: string;
  category: string;
  proposedAmount: number;
  approvedAmount?: number | null;
  vendorOrPlatform: string;
  approvalStatus: BudgetApprovalStatus;
  submittedToFinanceAt?: string | null;
  approvedByFinance?: string | null;
  approvedAt?: string | null;
  journalEntryRef?: string | null;
  requestedBy: string;
  justification?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFeedbackSurveyItem {
  id: string;
  surveyCode: string;
  title: string;
  targetAudience: SurveyTargetAudience;
  channel: string;
  status: SurveyStatus;
  totalResponses: number;
  averageCSATScore: number;
  brandPerceptionScore: number;
  keyStrengths: string[];
  improvementAreas: string[];
  questionsJson: any[];
  feedbackResponses?: Array<{
    responseId: string;
    respondentCompany: string;
    csatRating: number;
    brandPerceptionRating: number;
    feedbackText: string;
    submittedAt: string;
  }> | null;
  publishedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingOverviewMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalBudgetAllocated: number;
  totalActualSpent: number;
  totalLeadsGenerated: number;
  totalPipelineValue: number;
  averageRoiPct: number;
  totalAssetsCount: number;
  totalAssetDownloads: number;
  avgMarketDemandIndex: number;
  avgCsatScore: number;
  avgBrandPerception: number;
}
