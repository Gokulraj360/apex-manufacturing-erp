import { TaxReportType } from '@prisma/client';

export interface DateFilterReportDto {
  startDate?: string;
  endDate?: string;
}

export interface GenerateTaxReportDto {
  taxPeriod: string;
  reportType: TaxReportType;
  taxableSales: number;
  outputTax: number;
  taxablePurchases: number;
  inputTaxCredit: number;
  notes?: string;
}

export interface FileTaxReportDto {
  taxReportId: string;
  filingConfirmationRef?: string;
}
