import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePollingDto } from './dto/create-polling.dto';
import { QueryPollingDto } from './dto/query-polling.dto';

@Injectable()
export class PollingService {
  constructor(private prisma: PrismaService) {}

  private pollingInclude(userId: string) {
    return {
      options: { orderBy: { sortOrder: 'asc' as const } },
      _count: { select: { votes: true } },
      votes: {
        where: { userId },
        select: { optionId: true },
      },
    };
  }

  async findAll(query: QueryPollingDto, userId: string) {
    const { page = 1, limit = 10, status } = query;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.polling.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          options: {
            include: { _count: { select: { votes: true } } },
            orderBy: { sortOrder: 'asc' },
          },
          _count: { select: { votes: true } },
          votes: { where: { userId }, select: { optionId: true } },
        },
      }),
      this.prisma.polling.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const polling = await this.prisma.polling.findUnique({
      where: { id },
      include: {
        options: {
          include: { _count: { select: { votes: true } } },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { votes: true } },
        votes: { where: { userId }, select: { optionId: true } },
      },
    });
    if (!polling) throw new NotFoundException('Polling tidak ditemukan');
    return polling;
  }

  async create(dto: CreatePollingDto, userId: string) {
    return this.prisma.polling.create({
      data: {
        title: dto.title,
        description: dto.description ?? null,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
        isAnonymous: dto.isAnonymous ?? false,
        createdBy: userId,
        options: {
          create: dto.options.map((label, i) => ({ label, sortOrder: i })),
        },
      },
      include: {
        options: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { votes: true } },
      },
    });
  }

  async vote(pollingId: string, optionId: string, userId: string) {
    const polling = await this.prisma.polling.findUnique({
      where: { id: pollingId },
      include: { options: true },
    });
    if (!polling) throw new NotFoundException('Polling tidak ditemukan');
    if (polling.status !== 'AKTIF') {
      throw new BadRequestException('Polling sudah tidak aktif');
    }
    if (polling.deadline && new Date(polling.deadline) < new Date()) {
      throw new BadRequestException('Waktu voting sudah berakhir');
    }
    if (!polling.options.find((o) => o.id === optionId)) {
      throw new BadRequestException('Opsi tidak valid');
    }

    // Upsert: ganti vote kalau sudah pernah vote
    const existing = await this.prisma.pollingVote.findUnique({
      where: { pollingId_userId: { pollingId, userId } },
    });

    if (existing) {
      if (existing.optionId === optionId) {
        // Unvote
        await this.prisma.pollingVote.delete({
          where: { pollingId_userId: { pollingId, userId } },
        });
        return { message: 'Vote dibatalkan' };
      }
      // Ganti opsi
      return this.prisma.pollingVote.update({
        where: { pollingId_userId: { pollingId, userId } },
        data: { optionId },
      });
    }

    return this.prisma.pollingVote.create({
      data: { pollingId, optionId, userId },
    });
  }

  async closePolling(id: string, status: 'SELESAI' | 'DIBATALKAN', adminId: string) {
    const polling = await this.prisma.polling.findUnique({ where: { id } });
    if (!polling) throw new NotFoundException('Polling tidak ditemukan');
    return this.prisma.polling.update({ where: { id }, data: { status } });
  }

  async delete(id: string) {
    const polling = await this.prisma.polling.findUnique({ where: { id } });
    if (!polling) throw new NotFoundException('Polling tidak ditemukan');
    return this.prisma.polling.delete({ where: { id } });
  }
}
