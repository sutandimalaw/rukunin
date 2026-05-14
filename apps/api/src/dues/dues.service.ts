import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FinanceService } from '../finance/finance.service';
import { GenerateDuesDto } from './dto/generate-dues.dto';
import { QueryDuesDto } from './dto/query-dues.dto';
import { PayDuesDto } from './dto/pay-dues.dto';
import { BatchPayDuesDto } from './dto/batch-pay-dues.dto';
import { RequestPayDuesDto } from './dto/request-pay-dues.dto';

@Injectable()
export class DuesService {
  constructor(
    private prisma: PrismaService,
    private financeService: FinanceService,
  ) {}

  async findAll(query: QueryDuesDto) {
    const { page = 1, limit = 50, period, status } = query;
    const where: Prisma.DuesBillingWhereInput = {};

    if (period) where.period = period;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.duesBilling.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          household: {
            select: {
              id: true,
              kkNumber: true,
              blok: true,
              houseNumber: true,
              members: {
                where: { familyRelation: 'KEPALA_KELUARGA' },
                select: { fullName: true },
                take: 1,
              },
            },
          },
        },
      }),
      this.prisma.duesBilling.count({ where }),
    ]);

    return {
      data: data.map((d) => ({
        ...d,
        household: {
          ...d.household,
          kepalaKeluarga: d.household.members[0]?.fullName ?? '-',
          members: undefined,
        },
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getByHousehold(householdId: string) {
    const data = await this.prisma.duesBilling.findMany({
      where: { householdId },
      include: {
        household: {
          select: {
            kkNumber: true,
            blok: true,
            houseNumber: true,
            members: {
              where: { familyRelation: 'KEPALA_KELUARGA' },
              select: { fullName: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { period: 'desc' },
    });
    return data.map((d) => ({
      ...d,
      household: {
        ...d.household,
        kepalaKeluarga: d.household.members[0]?.fullName ?? '-',
        members: undefined,
      },
    }));
  }

  async getSummary(period?: string) {
    const billings = await this.prisma.duesBilling.findMany({
      where: period ? { period } : undefined,
    });

    const totalKK = billings.length;
    const paid = billings.filter((b) => b.status === 'PAID').length;
    const pending = billings.filter((b) => b.status === 'PENDING').length;
    const unpaid = billings.filter((b) => b.status === 'UNPAID').length;
    const totalCollected = billings
      .filter((b) => b.status === 'PAID')
      .reduce((sum, b) => sum + Number(b.amount), 0);
    const totalExpected = billings.reduce(
      (sum, b) => sum + Number(b.amount),
      0,
    );

    return { totalKK, paid, pending, unpaid, totalCollected, totalExpected };
  }

  async generate(dto: GenerateDuesDto, userId: string) {
    const households = await this.prisma.household.findMany({
      select: { id: true },
    });

    const existing = await this.prisma.duesBilling.findMany({
      where: { period: dto.period },
      select: { householdId: true },
    });
    const existingIds = new Set(existing.map((e) => e.householdId));

    const toCreate = households.filter((h) => !existingIds.has(h.id));

    if (toCreate.length === 0) {
      return {
        created: 0,
        message: 'Semua KK sudah punya tagihan untuk periode ini',
      };
    }

    await this.prisma.duesBilling.createMany({
      data: toCreate.map((h) => ({
        householdId: h.id,
        period: dto.period,
        amount: dto.amount,
        status: 'UNPAID',
      })),
    });

    return {
      created: toCreate.length,
      message: `${toCreate.length} tagihan berhasil dibuat`,
    };
  }

  async pay(id: string, dto: PayDuesDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const billing = await tx.duesBilling.findUnique({
        where: { id },
        include: {
          household: {
            include: {
              members: {
                where: { familyRelation: 'KEPALA_KELUARGA' },
                select: { fullName: true },
                take: 1,
              },
            },
          },
        },
      });

      if (!billing) {
        throw new NotFoundException('Tagihan tidak ditemukan');
      }

      const kepalaKeluarga =
        billing.household.members[0]?.fullName ?? billing.household.kkNumber;
      const description = `Iuran warga - ${kepalaKeluarga} - Periode ${billing.period}`;

      const transaction = await this.financeService.createWithTx(
        tx,
        {
          type: 'IN',
          category: 'iuran',
          amount: Number(billing.amount),
          description,
        },
        userId,
      );

      return tx.duesBilling.update({
        where: { id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          paidBy: userId,
          notes: dto.notes ?? billing.notes,
          transactionId: transaction.id,
        },
      });
    });
  }

  async unpay(id: string) {
    const billing = await this.prisma.duesBilling.findUnique({
      where: { id },
    });

    if (!billing) {
      throw new NotFoundException('Tagihan tidak ditemukan');
    }

    if (billing.transactionId) {
      await this.financeService.remove(billing.transactionId);
    }

    return this.prisma.duesBilling.update({
      where: { id },
      data: {
        status: 'UNPAID',
        paidAt: null,
        paidBy: null,
        transactionId: null,
      },
    });
  }

  async getDelinquent(minMonths: number, lookbackMonths: number) {
    const periods: string[] = [];
    const now = new Date();
    for (let i = 0; i < lookbackMonths; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      periods.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      );
    }

    const unpaid = await this.prisma.duesBilling.findMany({
      where: {
        period: { in: periods },
        status: 'UNPAID',
      },
      include: {
        household: {
          select: {
            id: true,
            kkNumber: true,
            blok: true,
            houseNumber: true,
            members: {
              where: { familyRelation: 'KEPALA_KELUARGA' },
              select: { fullName: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { period: 'desc' },
    });

    const grouped = new Map<
      string,
      {
        household: {
          id: string;
          kkNumber: string;
          blok: string | null;
          houseNumber: string | null;
          kepalaKeluarga: string;
        };
        unpaidPeriods: { id: string; period: string }[];
        totalAmount: number;
      }
    >();

    for (const b of unpaid) {
      if (!grouped.has(b.householdId)) {
        grouped.set(b.householdId, {
          household: {
            id: b.household.id,
            kkNumber: b.household.kkNumber,
            blok: b.household.blok,
            houseNumber: b.household.houseNumber,
            kepalaKeluarga: b.household.members[0]?.fullName ?? '-',
          },
          unpaidPeriods: [],
          totalAmount: 0,
        });
      }
      const entry = grouped.get(b.householdId)!;
      entry.unpaidPeriods.push({ id: b.id, period: b.period });
      entry.totalAmount += Number(b.amount);
    }

    return Array.from(grouped.values())
      .filter((e) => e.unpaidPeriods.length >= minMonths)
      .sort((a, b) => b.unpaidPeriods.length - a.unpaidPeriods.length);
  }

  async getMyDues(userEmail: string) {
    const resident = await this.prisma.resident.findFirst({
      where: { email: userEmail },
      include: {
        household: {
          select: {
            id: true,
            kkNumber: true,
            blok: true,
            houseNumber: true,
          },
        },
      },
    });

    if (!resident) {
      throw new NotFoundException(
        'Data warga tidak ditemukan. Pastikan email kamu terdaftar di data RT.',
      );
    }

    const billings = await this.prisma.duesBilling.findMany({
      where: { householdId: resident.householdId },
      orderBy: { period: 'desc' },
    });

    return {
      household: resident.household,
      billings: billings.map((b) => ({
        id: b.id,
        period: b.period,
        amount: b.amount,
        status: b.status,
        paidAt: b.paidAt,
        notes: b.notes,
      })),
    };
  }

  async batchPay(dto: BatchPayDuesDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const billings = await tx.duesBilling.findMany({
        where: { id: { in: dto.ids }, status: 'UNPAID' },
        include: {
          household: {
            include: {
              members: {
                where: { familyRelation: 'KEPALA_KELUARGA' },
                select: { fullName: true },
                take: 1,
              },
            },
          },
        },
      });

      for (const billing of billings) {
        const kepalaKeluarga =
          billing.household.members[0]?.fullName ?? billing.household.kkNumber;
        const description = `Iuran warga - ${kepalaKeluarga} - Periode ${billing.period}`;

        const transaction = await this.financeService.createWithTx(
          tx,
          {
            type: 'IN',
            category: 'iuran',
            amount: Number(billing.amount),
            description,
          },
          userId,
        );

        await tx.duesBilling.update({
          where: { id: billing.id },
          data: {
            status: 'PAID',
            paidAt: new Date(),
            paidBy: userId,
            notes: dto.notes ?? null,
            transactionId: transaction.id,
          },
        });
      }

      return {
        updated: billings.length,
        message: `${billings.length} tagihan berhasil dilunasi`,
      };
    });
  }

  async requestPay(dto: RequestPayDuesDto) {
    const result = await this.prisma.duesBilling.updateMany({
      where: {
        id: { in: dto.ids },
        status: 'UNPAID',
      },
      data: {
        status: 'PENDING',
      },
    });

    if (result.count === 0) {
      throw new BadRequestException(
        'Tidak ada tagihan yang dapat diajukan (pastikan status masih UNPAID)',
      );
    }

    return {
      updated: result.count,
      message: `${result.count} tagihan berhasil diajukan, menunggu konfirmasi admin`,
    };
  }

  async rejectPay(id: string) {
    const billing = await this.prisma.duesBilling.findUnique({
      where: { id },
    });

    if (!billing) {
      throw new NotFoundException('Tagihan tidak ditemukan');
    }

    if (billing.status !== 'PENDING') {
      throw new BadRequestException('Hanya tagihan berstatus PENDING yang dapat ditolak');
    }

    return this.prisma.duesBilling.update({
      where: { id },
      data: {
        status: 'UNPAID',
        paidAt: null,
        paidBy: null,
      },
    });
  }
}
