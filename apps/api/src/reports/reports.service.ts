import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportQueryDto } from './dto/report-query.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getFinancialReport(query: ReportQueryDto) {
    const where: {
      date?: { gte?: Date; lte?: Date };
    } = {};

    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) where.date.gte = new Date(query.startDate);
      if (query.endDate) where.date.lte = new Date(query.endDate);
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      orderBy: { date: 'asc' },
      select: {
        id: true,
        date: true,
        type: true,
        category: true,
        amount: true,
        description: true,
        balance: true,
      },
    });

    // Hitung total
    let totalIn = 0;
    let totalOut = 0;
    const byCategory: Record<string, { in: number; out: number }> = {};
    const byMonth: Record<string, { in: number; out: number }> = {};

    for (const t of transactions) {
      const amount = Number(t.amount);
      const monthKey = t.date.toISOString().slice(0, 7); // YYYY-MM
      const cat = t.category;

      if (t.type === 'IN') {
        totalIn += amount;
      } else {
        totalOut += amount;
      }

      // by category
      if (!byCategory[cat]) byCategory[cat] = { in: 0, out: 0 };
      if (t.type === 'IN') byCategory[cat].in += amount;
      else byCategory[cat].out += amount;

      // by month
      if (!byMonth[monthKey]) byMonth[monthKey] = { in: 0, out: 0 };
      if (t.type === 'IN') byMonth[monthKey].in += amount;
      else byMonth[monthKey].out += amount;
    }

    const currentBalance =
      transactions.length > 0
        ? Number(transactions[transactions.length - 1].balance)
        : 0;

    return {
      summary: {
        totalIn,
        totalOut,
        netBalance: totalIn - totalOut,
        currentBalance,
        transactionCount: transactions.length,
      },
      byMonth: Object.entries(byMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, val]) => ({ month, ...val, net: val.in - val.out })),
      byCategory: Object.entries(byCategory).map(([category, val]) => ({
        category,
        ...val,
        net: val.in - val.out,
      })),
    };
  }

  async getResidentsReport() {
    const [total, byBlok, byOwnership, byGender] = await Promise.all([
      this.prisma.resident.count(),

      this.prisma.resident.groupBy({
        by: ['blok'],
        _count: { id: true },
        orderBy: { blok: 'asc' },
      }),

      this.prisma.resident.groupBy({
        by: ['ownershipStatus'],
        _count: { id: true },
      }),

      this.prisma.resident.groupBy({
        by: ['gender'],
        _count: { id: true },
      }),
    ]);

    return {
      total,
      byBlok: byBlok.map((r) => ({
        blok: r.blok ?? 'Tidak diketahui',
        count: r._count.id,
      })),
      byOwnership: byOwnership.map((r) => ({
        ownershipStatus: r.ownershipStatus ?? 'Tidak diketahui',
        count: r._count.id,
      })),
      byGender: byGender.map((r) => ({
        gender: r.gender,
        count: r._count.id,
      })),
    };
  }
}
