import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  QuerySubcontractChallansDto,
  SettleChallanDto,
  SubcontractStatusEnum,
} from './dto/subcontracting.dto';

export interface SubcontractChallanRecord {
  id: string;
  challanNo: string;
  challanDate: string;
  vendorName: string;
  vendorGstin: string;
  processName: string;
  itemName: string;
  itemSku: string;
  sentQty: number;
  returnedQty: number;
  toleranceRate: number; // e.g. 0.005 for 0.5%
  allowedScrapQty: number;
  actualScrapQty: number;
  unitValue: number;
  excessScrapQty: number;
  penaltyAmount: number;
  status: 'TOLERANCE_APPROVED' | 'SHORTAGE_PENALTY' | 'SETTLED';
  settlementRef?: string;
  settledAt?: string;
  settlementNotes?: string;
}

@Injectable()
export class SubcontractingService {
  private readonly logger = new Logger(SubcontractingService.name);

  // In-memory master ledger for subcontract challans - clean slate empty
  private challans: SubcontractChallanRecord[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QuerySubcontractChallansDto) {
    let result = [...this.challans];

    if (query.status) {
      result = result.filter((c) => c.status === query.status);
    }

    if (query.vendorName) {
      const v = query.vendorName.toLowerCase();
      result = result.filter((c) => c.vendorName.toLowerCase().includes(v));
    }

    if (query.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.challanNo.toLowerCase().includes(s) ||
          c.vendorName.toLowerCase().includes(s) ||
          c.processName.toLowerCase().includes(s) ||
          c.itemName.toLowerCase().includes(s)
      );
    }

    // KPI Metrics calculation
    const totalSent = this.challans.reduce((sum, c) => sum + c.sentQty, 0);
    const totalReturned = this.challans.reduce((sum, c) => sum + c.returnedQty, 0);
    const totalPenaltyFlagged = this.challans.filter((c) => c.status === 'SHORTAGE_PENALTY').length;
    const totalPenaltyAmount = this.challans.reduce((sum, c) => sum + c.penaltyAmount, 0);
    const approvedWithinTolerance = this.challans.filter((c) => c.status === 'TOLERANCE_APPROVED').length;
    const settledCount = this.challans.filter((c) => c.status === 'SETTLED').length;

    return {
      summary: {
        totalChallans: this.challans.length,
        totalSent,
        totalReturned,
        approvedWithinTolerance,
        totalPenaltyFlagged,
        totalPenaltyAmount,
        settledCount,
      },
      challans: result,
    };
  }

  async findOne(id: string) {
    const challan = this.challans.find((c) => c.id === id || c.challanNo === id);
    if (!challan) {
      throw new NotFoundException(`Subcontract challan '${id}' not found.`);
    }
    return challan;
  }

  async settleChallan(id: string, dto: SettleChallanDto) {
    const challan = await this.findOne(id);

    if (challan.status === 'SETTLED') {
      throw new BadRequestException(`Challan '${challan.challanNo}' is already settled.`);
    }

    const settledAt = new Date().toISOString();
    const settlementRef = `SETTLE-SC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const effectivePenalty = Math.max(
      0,
      challan.penaltyAmount - (dto.waivePenaltyAmount || 0)
    );

    challan.status = 'SETTLED';
    challan.settlementRef = settlementRef;
    challan.settledAt = settledAt;
    challan.settlementNotes =
      dto.settlementNotes ||
      (challan.excessScrapQty > 0
        ? `Settled with AP debit adjustment of ₹${effectivePenalty.toLocaleString('en-IN')} for ${challan.excessScrapQty} excess scrap units.`
        : 'Settled within standard 0.5% scrap tolerance. Full payment approved.');

    // Try sync with Prisma if record exists
    try {
      await (this.prisma as any).subcontractChallan.updateMany({
        where: { challanNo: challan.challanNo },
        data: {
          status: 'SETTLED',
        },
      });
    } catch {
      // In-memory fallback
    }

    this.logger.log(
      `Subcontract Challan ${challan.challanNo} successfully settled under ref ${settlementRef}. Penalty: ₹${effectivePenalty}`
    );

    return {
      message: `Challan ${challan.challanNo} settled successfully.`,
      settlementRef,
      challanNo: challan.challanNo,
      vendorName: challan.vendorName,
      status: 'SETTLED',
      settledAt,
      excessScrapQty: challan.excessScrapQty,
      penaltyDeducted: effectivePenalty,
      notes: challan.settlementNotes,
    };
  }
}
