import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';
import { CreateBukuTamuDto } from './dto/create-buku-tamu.dto';
import { QueryBukuTamuDto } from './dto/query-buku-tamu.dto';
import { CreateLaporanInsidenDto } from './dto/create-laporan-insiden.dto';
import { UpdateInsidenStatusDto } from './dto/update-insiden-status.dto';
import { QueryLaporanInsidenDto } from './dto/query-laporan-insiden.dto';

@Injectable()
export class KeamananService {
  constructor(private prisma: PrismaService) {}

  private reporterSelect = {
    reporter: {
      select: {
        id: true,
        email: true,
        profile: { select: { fullName: true } },
      },
    },
    processor: {
      select: {
        id: true,
        email: true,
        profile: { select: { fullName: true } },
      },
    },
  };

  // ─── Summary / Dashboard ────────────────────────────────────────────

  async getSummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [tamuHariIni, insidenAktif, panicButton, petugasBertugas] =
      await Promise.all([
        this.prisma.bukuTamu.count({
          where: {
            checkInTime: { gte: today, lt: tomorrow },
          },
        }),
        this.prisma.laporanInsiden.count({
          where: { status: { in: ['DILAPORKAN', 'DITINDAK'] } },
        }),
        this.prisma.laporanInsiden.count({
          where: {
            severity: 'DARURAT',
            status: { in: ['DILAPORKAN', 'DITINDAK'] },
          },
        }),
        this.prisma.petugasKeamanan.count({
          where: { isOnDuty: true, isActive: true },
        }),
      ]);

    return { tamuHariIni, insidenAktif, panicButton, petugasBertugas };
  }

  // ─── Petugas Keamanan ───────────────────────────────────────────────

  async findAllPetugas() {
    return this.prisma.petugasKeamanan.findMany({
      where: { isActive: true },
      orderBy: [
        { shift: 'asc' },
        { fullName: 'asc' },
      ],
    });
  }

  async createPetugas(dto: CreatePetugasDto, userId: string) {
    return this.prisma.petugasKeamanan.create({
      data: {
        fullName: dto.fullName,
        shift: dto.shift,
        shiftTime: dto.shiftTime,
        whatsapp: dto.whatsapp ?? null,
        isOnDuty: dto.isOnDuty ?? false,
        createdBy: userId,
      },
    });
  }

  async updatePetugas(id: string, dto: UpdatePetugasDto) {
    const petugas = await this.prisma.petugasKeamanan.findUnique({
      where: { id },
    });
    if (!petugas) throw new NotFoundException('Petugas tidak ditemukan');

    return this.prisma.petugasKeamanan.update({
      where: { id },
      data: dto,
    });
  }

  async deletePetugas(id: string) {
    const petugas = await this.prisma.petugasKeamanan.findUnique({
      where: { id },
    });
    if (!petugas) throw new NotFoundException('Petugas tidak ditemukan');

    return this.prisma.petugasKeamanan.delete({ where: { id } });
  }

  // ─── Buku Tamu ──────────────────────────────────────────────────────

  async findAllTamu(query: QueryBukuTamuDto) {
    const { page = 1, limit = 20, date } = query;
    const where: Record<string, unknown> = {};

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.checkInTime = { gte: start, lt: end };
    }

    const [data, total] = await Promise.all([
      this.prisma.bukuTamu.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { checkInTime: 'desc' },
        include: {
          recorder: {
            select: {
              id: true,
              email: true,
              profile: { select: { fullName: true } },
            },
          },
        },
      }),
      this.prisma.bukuTamu.count({ where }),
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

  async createTamu(dto: CreateBukuTamuDto, userId: string) {
    return this.prisma.bukuTamu.create({
      data: {
        guestName: dto.guestName,
        purpose: dto.purpose,
        destinationBlock: dto.destinationBlock ?? null,
        vehicleType: dto.vehicleType ?? null,
        vehicleNumber: dto.vehicleNumber ?? null,
        notes: dto.notes ?? null,
        recordedBy: userId,
      },
    });
  }

  async checkOutTamu(id: string) {
    const tamu = await this.prisma.bukuTamu.findUnique({ where: { id } });
    if (!tamu) throw new NotFoundException('Data tamu tidak ditemukan');
    if (tamu.checkOutTime) {
      throw new BadRequestException('Tamu sudah tercatat keluar');
    }

    return this.prisma.bukuTamu.update({
      where: { id },
      data: { checkOutTime: new Date() },
    });
  }

  // ─── Laporan Insiden ────────────────────────────────────────────────

  async findAllInsiden(
    query: QueryLaporanInsidenDto,
    currentUser: { id: string; role: string },
  ) {
    const { page = 1, limit = 10, status, category, severity } = query;
    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (severity) where.severity = severity;

    // Warga hanya lihat laporan miliknya
    if (currentUser.role !== 'ADMIN') {
      where.reportedBy = currentUser.id;
    }

    const [data, total] = await Promise.all([
      this.prisma.laporanInsiden.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: this.reporterSelect,
      }),
      this.prisma.laporanInsiden.count({ where }),
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

  async createInsiden(dto: CreateLaporanInsidenDto, userId: string) {
    return this.prisma.laporanInsiden.create({
      data: {
        category: dto.category,
        title: dto.title,
        description: dto.description,
        location: dto.location ?? null,
        severity: dto.severity ?? 'SEDANG',
        incidentDate: new Date(dto.incidentDate),
        reportedBy: userId,
      },
      include: this.reporterSelect,
    });
  }

  async updateInsidenStatus(
    id: string,
    dto: UpdateInsidenStatusDto,
    adminId: string,
  ) {
    const insiden = await this.prisma.laporanInsiden.findUnique({
      where: { id },
    });
    if (!insiden) throw new NotFoundException('Laporan tidak ditemukan');

    if (insiden.status === 'SELESAI' || insiden.status === 'DITUTUP') {
      throw new BadRequestException(
        `Laporan sudah ${insiden.status}, tidak bisa diubah lagi`,
      );
    }

    return this.prisma.laporanInsiden.update({
      where: { id },
      data: {
        status: dto.status,
        adminNotes: dto.adminNotes ?? insiden.adminNotes,
        processedBy: adminId,
        processedAt: new Date(),
      },
      include: this.reporterSelect,
    });
  }

  async cancelInsiden(
    id: string,
    currentUser: { id: string; role: string },
  ) {
    const insiden = await this.prisma.laporanInsiden.findUnique({
      where: { id },
    });
    if (!insiden) throw new NotFoundException('Laporan tidak ditemukan');

    if (
      currentUser.role !== 'ADMIN' &&
      insiden.reportedBy !== currentUser.id
    ) {
      throw new ForbiddenException('Anda tidak punya akses');
    }

    if (insiden.status !== 'DILAPORKAN') {
      throw new BadRequestException(
        'Hanya laporan berstatus DILAPORKAN yang bisa dibatalkan',
      );
    }

    return this.prisma.laporanInsiden.delete({ where: { id } });
  }
}
