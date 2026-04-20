import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryTransactionDto) {
    const { page = 1, limit = 50, type, category, startDate, endDate } = query;
    const where: Prisma.TransactionWhereInput = {};

    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    const lastTransaction = await this.prisma.transaction.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return {
      data,
      balance: lastTransaction?.balance ?? 0,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSummary() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [lastTransaction, incomeThisMonth, expensesThisMonth] =
      await Promise.all([
        this.prisma.transaction.findFirst({
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.transaction.aggregate({
          _sum: { amount: true },
          where: { type: 'IN', createdAt: { gte: startOfMonth } },
        }),
        this.prisma.transaction.aggregate({
          _sum: { amount: true },
          where: { type: 'OUT', createdAt: { gte: startOfMonth } },
        }),
      ]);

    return {
      currentBalance: lastTransaction?.balance ?? 0,
      incomeThisMonth: incomeThisMonth._sum.amount ?? 0,
      expensesThisMonth: expensesThisMonth._sum.amount ?? 0,
    };
  }

  async create(dto: CreateTransactionDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const lastTransaction = await tx.transaction.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      const previousBalance = lastTransaction
        ? Number(lastTransaction.balance)
        : 0;

      const newBalance =
        dto.type === 'IN'
          ? previousBalance + dto.amount
          : previousBalance - dto.amount;

      return tx.transaction.create({
        data: {
          date: dto.date ? new Date(dto.date) : new Date(),
          type: dto.type,
          category: dto.category,
          amount: dto.amount,
          description: dto.description,
          balance: newBalance,
          createdBy: userId,
        },
      });
    });
  }

  async remove(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    await this.prisma.transaction.delete({ where: { id } });

    // Recalculate balances for subsequent transactions
    const allTransactions = await this.prisma.transaction.findMany({
      orderBy: { createdAt: 'asc' },
    });

    let runningBalance = 0;
    for (const tx of allTransactions) {
      runningBalance =
        tx.type === 'IN'
          ? runningBalance + Number(tx.amount)
          : runningBalance - Number(tx.amount);

      await this.prisma.transaction.update({
        where: { id: tx.id },
        data: { balance: runningBalance },
      });
    }

    return { message: 'Transaksi dihapus dan saldo diperbarui' };
  }
}
