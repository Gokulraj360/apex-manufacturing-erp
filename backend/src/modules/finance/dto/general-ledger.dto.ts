import { AccountType } from '@prisma/client';

export interface CreateAccountDto {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  description?: string;
  currency?: string;
  isHeader?: boolean;
  parentAccountId?: string;
}

export interface JournalLineDto {
  accountId: string;
  debit: number;
  credit: number;
  description?: string;
  entityRef?: string;
}

export interface CreateJournalEntryDto {
  entryDate?: string;
  memo: string;
  accountingPeriodId: string;
  lines: JournalLineDto[];
  sourceModule?: string;
  sourceReferenceId?: string;
}

export interface PostJournalEntryDto {
  journalEntryId: string;
}

export interface CreateAccountingPeriodDto {
  periodName: string;
  startDate: string;
  endDate: string;
}

export interface CloseAccountingPeriodDto {
  periodId: string;
}
