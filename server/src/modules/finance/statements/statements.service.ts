import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { QueryStatementsDto, StatementCategoryEnum } from '../dto/statements.dto';

export interface LedgerTransaction {
  id: string;
  voucherRef: string;
  date: string;
  partyName: string;
  partyType: 'CUSTOMER' | 'VENDOR' | 'STATUTORY_TAX' | 'BANK';
  transactionType: 'SALES_CREDIT' | 'VENDOR_DEBIT' | 'TAX_PAYMENT' | 'RTV_RECOVERY';
  description: string;
  debit: number; // Outflow (₹)
  credit: number; // Inflow (₹)
  balance: number;
  clearanceStatus: 'CLEARED' | 'RECONCILED' | 'PENDING_BANK';
}

export interface StatementSummary {
  periodMetrics: {
    startDate: string;
    endDate: string;
    totalPeriodInflow: number;
    totalPeriodOutflow: number;
    netPeriodCashFlow: number;
    filteredRecordsCount: number;
  };
  transactions: LedgerTransaction[];
}

@Injectable()
export class StatementsService {
  private readonly logger = new Logger(StatementsService.name);

  // In-memory General Ledger database
  private ledgerTransactions: LedgerTransaction[] = [
    {
      id: 'tx-01',
      voucherRef: 'RV-2026-1001',
      date: '2026-10-01',
      partyName: 'Reliance Retail Electronics Ltd',
      partyType: 'CUSTOMER',
      transactionType: 'SALES_CREDIT',
      description: 'Advance receipt against Bulk Delivery Order SO-2026-0881',
      debit: 0,
      credit: 150000000.0, // ₹15.00 Cr
      balance: 150000000.0,
      clearanceStatus: 'CLEARED',
    },
    {
      id: 'tx-02',
      voucherRef: 'PV-2026-0901',
      date: '2026-10-02',
      partyName: 'Sony Semiconductor Solutions Inc.',
      partyType: 'VENDOR',
      transactionType: 'VENDOR_DEBIT',
      description: 'Vendor AP clearance for Optical Sensors Consignment PO-2026-0881',
      debit: 26500000.0, // ₹2.65 Cr
      credit: 0,
      balance: 123500000.0,
      clearanceStatus: 'CLEARED',
    },
    {
      id: 'tx-03',
      voucherRef: 'RV-2026-1002',
      date: '2026-10-02',
      partyName: 'Bharti Airtel Enterprise Supply',
      partyType: 'CUSTOMER',
      transactionType: 'SALES_CREDIT',
      description: 'Milestone payment for 5G device dispatch INV-2026-0902',
      debit: 0,
      credit: 109740000.0, // ₹10.974 Cr
      balance: 233240000.0,
      clearanceStatus: 'CLEARED',
    },
    {
      id: 'tx-04',
      voucherRef: 'PV-2026-0902',
      date: '2026-10-03',
      partyName: 'Samsung Display Co., Ltd.',
      partyType: 'VENDOR',
      transactionType: 'VENDOR_DEBIT',
      description: 'Commercial invoice settlement for 120Hz LTPO OLED displays',
      debit: 34000000.0, // ₹3.40 Cr
      credit: 0,
      balance: 199240000.0,
      clearanceStatus: 'RECONCILED',
    },
    {
      id: 'tx-05',
      voucherRef: 'DN-2026-0042',
      date: '2026-10-03',
      partyName: 'Sony Semiconductor Solutions Inc.',
      partyType: 'VENDOR',
      transactionType: 'RTV_RECOVERY',
      description: 'AP Debit Note recovery for 450 dead pixel optical sensors (RTV-2026-0018)',
      debit: 0,
      credit: 1192500.0, // ₹11.92 Lakhs
      balance: 200432500.0,
      clearanceStatus: 'CLEARED',
    },
    {
      id: 'tx-06',
      voucherRef: 'PV-2026-0903',
      date: '2026-10-04',
      partyName: 'Amperex Technology Ltd (ATL)',
      partyType: 'VENDOR',
      transactionType: 'VENDOR_DEBIT',
      description: 'Vendor AP payment for 10,000 dual-cell battery packs',
      debit: 9800000.0, // ₹98.00 Lakhs
      credit: 0,
      balance: 190632500.0,
      clearanceStatus: 'CLEARED',
    },
    {
      id: 'tx-07',
      voucherRef: 'RV-2026-1003',
      date: '2026-10-04',
      partyName: 'Tata Croma Digital Logistics',
      partyType: 'CUSTOMER',
      transactionType: 'SALES_CREDIT',
      description: 'Customer credit payment for 4,800 finished smartphones',
      debit: 0,
      credit: 84960000.0, // ₹8.496 Cr
      balance: 275592500.0,
      clearanceStatus: 'CLEARED',
    },
    {
      id: 'tx-08',
      voucherRef: 'TX-2026-0010',
      date: '2026-10-05',
      partyName: 'Goods and Services Tax Network (GSTN)',
      partyType: 'STATUTORY_TAX',
      transactionType: 'TAX_PAYMENT',
      description: 'Output IGST 18% statutory tax deposit for October cycle',
      debit: 77130000.0, // ₹7.713 Cr
      credit: 0,
      balance: 198462500.0,
      clearanceStatus: 'RECONCILED',
    },
    {
      id: 'tx-09',
      voucherRef: 'RV-2026-1004',
      date: '2026-10-05',
      partyName: 'Amazon Seller Services India',
      partyType: 'CUSTOMER',
      transactionType: 'SALES_CREDIT',
      description: 'Sales disbursement receipt for Diwali festival inventory',
      debit: 0,
      credit: 90270000.0, // ₹9.027 Cr
      balance: 288732500.0,
      clearanceStatus: 'PENDING_BANK',
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Filter General Ledger statements date-wise and category-wise
   */
  async getLedgerStatements(query: QueryStatementsDto): Promise<StatementSummary> {
    const { startDate, endDate, category = StatementCategoryEnum.ALL, search } = query;

    let filtered = [...this.ledgerTransactions];

    // Filter by Date Range
    if (startDate) {
      filtered = filtered.filter((t) => t.date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter((t) => t.date <= endDate);
    }

    // Filter by Category
    if (category === StatementCategoryEnum.INFLOW_CREDIT) {
      filtered = filtered.filter((t) => t.credit > 0);
    } else if (category === StatementCategoryEnum.OUTFLOW_DEBIT) {
      filtered = filtered.filter((t) => t.debit > 0);
    }

    // Filter by Search Term
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.voucherRef.toLowerCase().includes(q) ||
          t.partyName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    const totalInflow = filtered.reduce((sum, t) => sum + t.credit, 0);
    const totalOutflow = filtered.reduce((sum, t) => sum + t.debit, 0);

    return {
      periodMetrics: {
        startDate: startDate || '2026-10-01',
        endDate: endDate || '2026-10-05',
        totalPeriodInflow: totalInflow,
        totalPeriodOutflow: totalOutflow,
        netPeriodCashFlow: totalInflow - totalOutflow,
        filteredRecordsCount: filtered.length,
      },
      transactions: filtered,
    };
  }

  /**
   * Export CSV format for Excel statement download
   */
  async exportCsvStatement(query: QueryStatementsDto): Promise<string> {
    const data = await this.getLedgerStatements(query);
    const headers = [
      'Voucher Ref',
      'Date',
      'Party Name',
      'Party Type',
      'Transaction Type',
      'Description',
      'Debit (INR)',
      'Credit (INR)',
      'Running Balance (INR)',
      'Clearance Status',
    ];

    const rows = data.transactions.map((t) => [
      `"${t.voucherRef}"`,
      `"${t.date}"`,
      `"${t.partyName}"`,
      `"${t.partyType}"`,
      `"${t.transactionType}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.debit.toFixed(2),
      t.credit.toFixed(2),
      t.balance.toFixed(2),
      `"${t.clearanceStatus}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
