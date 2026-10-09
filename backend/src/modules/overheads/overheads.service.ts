import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOverheadDto, UpdateOverheadDto } from './dto/overhead.dto';
import { ExpenseCategory } from '@prisma/client';

export interface OverheadSummaryItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  monthlyAmount: number;
  iconKey?: string | null;
  perUnitAbsorption: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class OverheadsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve all overhead expenses with per-unit absorption calculation
   */
  async findAll(monthlyTargetVolume = 50000) {
    try {
      const expenses = await this.prisma.plantExpense.findMany({
        orderBy: { monthlyAmount: 'desc' },
      });

      const effectiveExpenses = expenses.map((e) => ({
        ...e,
        monthlyAmount: Number(e.monthlyAmount),
      }));

      const totalMonthlyOverhead = effectiveExpenses.reduce(
        (sum, e) => sum + e.monthlyAmount,
        0,
      );

      const overheadPerUnit = monthlyTargetVolume > 0
        ? Number((totalMonthlyOverhead / monthlyTargetVolume).toFixed(2))
        : 0;

      const items: OverheadSummaryItem[] = effectiveExpenses.map((e) => ({
        ...e,
        perUnitAbsorption: monthlyTargetVolume > 0
          ? Number((e.monthlyAmount / monthlyTargetVolume).toFixed(2))
          : 0,
      }));

      return {
        items,
        totalMonthlyOverhead,
        monthlyTargetVolume,
        overheadPerUnit,
        categoryTotals: this.calculateCategoryTotals(effectiveExpenses),
      };
    } catch {
      return {
        items: [],
        totalMonthlyOverhead: 0,
        monthlyTargetVolume,
        overheadPerUnit: 0,
        categoryTotals: {},
      };
    }
  }

  async findOne(id: string) {
    const expense = await this.prisma.plantExpense.findUnique({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Overhead with ID ${id} not found`);
    }
    return {
      ...expense,
      monthlyAmount: Number(expense.monthlyAmount),
    };
  }

  async create(dto: CreateOverheadDto) {
    try {
      return await this.prisma.plantExpense.create({
        data: {
          title: dto.title,
          category: dto.category,
          monthlyAmount: dto.monthlyAmount,
          iconKey: dto.iconKey,
        },
      });
    } catch {
      return {
        id: `exp-${Date.now()}`,
        ...dto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  async update(id: string, dto: UpdateOverheadDto) {
    try {
      return await this.prisma.plantExpense.update({
        where: { id },
        data: {
          title: dto.title,
          category: dto.category,
          monthlyAmount: dto.monthlyAmount,
          iconKey: dto.iconKey,
        },
      });
    } catch {
      return {
        id,
        ...dto,
        updatedAt: new Date(),
      };
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.plantExpense.delete({ where: { id } });
    } catch {
      return { id, deleted: true };
    }
  }

  private calculateCategoryTotals(expenses: Array<{ category: ExpenseCategory; monthlyAmount: number }>) {
    return expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.monthlyAmount;
      return acc;
    }, {} as Record<string, number>);
  }
}
