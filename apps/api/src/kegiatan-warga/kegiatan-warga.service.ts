import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKegiatanWargaDto } from './dto/create-kegiatan-warga.dto';
import { UpdateKegiatanWargaDto } from './dto/update-kegiatan-warga.dto';
import { ScheduleKegiatanDto } from './dto/schedule-kegiatan.dto';
import { QueryKegiatanWargaDto } from './dto/query-kegiatan-warga.dto';

@Injectable()
export class KegiatanWargaService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryKegiatanWargaDto) {
    const { page = 1, limit = 10, category, status } = query;
    const where: { category?: string; status?: string } = {};

    if (category) where.category = category;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.kegiatanWarga.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.kegiatanWarga.count({ where }),
    ]);

    const dataWithCounts = await Promise.all(
      data.map(async (k) => {
        const [voteCount, rsvpCount] = await Promise.all([
          this.prisma.kegiatanPeserta.count({
            where: { kegiatanId: k.id, type: 'VOTE' },
          }),
          this.prisma.kegiatanPeserta.count({
            where: { kegiatanId: k.id, type: 'RSVP' },
          }),
        ]);
        return { ...k, voteCount, rsvpCount };
      }),
    );

    return {
      data: dataWithCounts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUserId?: string) {
    const kegiatan = await this.prisma.kegiatanWarga.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: { select: { fullName: true } },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!kegiatan) {
      throw new NotFoundException('Kegiatan tidak ditemukan');
    }

    const voteCount = kegiatan.participants.filter((p) => p.type === 'VOTE').length;
    const rsvpCount = kegiatan.participants.filter((p) => p.type === 'RSVP').length;

    const myParticipation = currentUserId
      ? {
          hasVoted: kegiatan.participants.some(
            (p) => p.userId === currentUserId && p.type === 'VOTE',
          ),
          hasRsvp: kegiatan.participants.some(
            (p) => p.userId === currentUserId && p.type === 'RSVP',
          ),
        }
      : undefined;

    return { ...kegiatan, voteCount, rsvpCount, myParticipation };
  }

  async create(dto: CreateKegiatanWargaDto, userId: string) {
    return this.prisma.kegiatanWarga.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category ?? 'umum',
        status: 'OPEN_VOTE',
        minParticipants: dto.minParticipants ?? null,
        voteDeadline: dto.voteDeadline ? new Date(dto.voteDeadline) : null,
        isRecurring: dto.isRecurring ?? false,
        recurrenceRule: dto.recurrenceRule ?? null,
        createdBy: userId,
      },
    });
  }

  async update(id: string, dto: UpdateKegiatanWargaDto) {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.voteDeadline) data.voteDeadline = new Date(dto.voteDeadline);
    return this.prisma.kegiatanWarga.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.kegiatanWarga.delete({ where: { id } });
  }

  async vote(kegiatanId: string, userId: string) {
    const kegiatan = await this.prisma.kegiatanWarga.findUnique({
      where: { id: kegiatanId },
    });
    if (!kegiatan) throw new NotFoundException('Kegiatan tidak ditemukan');
    if (kegiatan.status !== 'OPEN_VOTE') {
      throw new BadRequestException('Voting sudah ditutup untuk kegiatan ini');
    }
    if (kegiatan.voteDeadline && new Date() > kegiatan.voteDeadline) {
      throw new BadRequestException('Batas waktu voting sudah lewat');
    }

    try {
      return await this.prisma.kegiatanPeserta.create({
        data: { kegiatanId, userId, type: 'VOTE' },
      });
    } catch {
      throw new ConflictException('Anda sudah vote untuk kegiatan ini');
    }
  }

  async unvote(kegiatanId: string, userId: string) {
    const existing = await this.prisma.kegiatanPeserta.findUnique({
      where: {
        kegiatanId_userId_type: { kegiatanId, userId, type: 'VOTE' },
      },
    });
    if (!existing) throw new NotFoundException('Anda belum vote');
    await this.prisma.kegiatanPeserta.delete({ where: { id: existing.id } });
    return { success: true };
  }

  async schedule(id: string, dto: ScheduleKegiatanDto) {
    const kegiatan = await this.prisma.kegiatanWarga.findUnique({
      where: { id },
    });
    if (!kegiatan) throw new NotFoundException('Kegiatan tidak ditemukan');
    if (kegiatan.status !== 'OPEN_VOTE') {
      throw new BadRequestException('Hanya kegiatan dengan status OPEN_VOTE yang bisa dijadwalkan');
    }

    if (kegiatan.minParticipants && !dto.force) {
      const voteCount = await this.prisma.kegiatanPeserta.count({
        where: { kegiatanId: id, type: 'VOTE' },
      });
      if (voteCount < kegiatan.minParticipants) {
        throw new BadRequestException(
          `Quorum belum tercapai (${voteCount}/${kegiatan.minParticipants}). Gunakan force=true untuk lanjut.`,
        );
      }
    }

    return this.prisma.kegiatanWarga.update({
      where: { id },
      data: {
        status: 'SCHEDULED',
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        location: dto.location ?? null,
      },
    });
  }

  async rsvp(kegiatanId: string, userId: string) {
    const kegiatan = await this.prisma.kegiatanWarga.findUnique({
      where: { id: kegiatanId },
    });
    if (!kegiatan) throw new NotFoundException('Kegiatan tidak ditemukan');
    if (kegiatan.status !== 'SCHEDULED') {
      throw new BadRequestException('RSVP hanya bisa untuk kegiatan yang sudah dijadwalkan');
    }

    try {
      return await this.prisma.kegiatanPeserta.create({
        data: { kegiatanId, userId, type: 'RSVP' },
      });
    } catch {
      throw new ConflictException('Anda sudah RSVP untuk kegiatan ini');
    }
  }

  async unrsvp(kegiatanId: string, userId: string) {
    const existing = await this.prisma.kegiatanPeserta.findUnique({
      where: {
        kegiatanId_userId_type: { kegiatanId, userId, type: 'RSVP' },
      },
    });
    if (!existing) throw new NotFoundException('Anda belum RSVP');
    await this.prisma.kegiatanPeserta.delete({ where: { id: existing.id } });
    return { success: true };
  }

  async cancel(id: string) {
    await this.findOne(id);
    return this.prisma.kegiatanWarga.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async complete(id: string) {
    const kegiatan = await this.prisma.kegiatanWarga.findUnique({ where: { id } });
    if (!kegiatan) throw new NotFoundException('Kegiatan tidak ditemukan');
    if (kegiatan.status !== 'SCHEDULED' && kegiatan.status !== 'ONGOING') {
      throw new BadRequestException('Hanya kegiatan SCHEDULED/ONGOING yang bisa diselesaikan');
    }
    return this.prisma.kegiatanWarga.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }
}
