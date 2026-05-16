import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLaporanDto } from './dto/create-laporan.dto';
import { QueryLaporanDto } from './dto/query-laporan.dto';
import { UpdateStatusLaporanDto } from './dto/update-status-laporan.dto';
import { CreateKomentarDto } from './dto/create-komentar.dto';

const PRIORITAS_ORDER = { PENTING: 0, NORMAL: 1, RENDAH: 2 };
const STATUS_ORDER = { MENUNGGU: 0, DIPROSES: 1, SELESAI: 2 };

@Injectable()
export class LaporanWargaService {
  constructor(private prisma: PrismaService) {}

  private async generateNomorLaporan(): Promise<string> {
    const count = await this.prisma.laporanWarga.count();
    return `RPT-${String(count + 1).padStart(3, '0')}`;
  }

  private buildWhere(query: QueryLaporanDto): Prisma.LaporanWargaWhereInput {
    const where: Prisma.LaporanWargaWhereInput = {};
    if (query.status) where.status = query.status;
    if (query.kategori) where.kategori = query.kategori;
    if (query.prioritas) where.prioritas = query.prioritas;
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }
    if (query.search) {
      where.OR = [
        { judul: { contains: query.search, mode: 'insensitive' } },
        { deskripsi: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private buildOrderBy(sort: string): Prisma.LaporanWargaOrderByWithRelationInput {
    switch (sort) {
      case 'TERLAMA':
        return { createdAt: 'asc' };
      case 'STATUS':
        return { status: 'asc' };
      case 'PRIORITAS':
        return { prioritas: 'asc' };
      default:
        return { createdAt: 'desc' };
    }
  }

  async findAll(query: QueryLaporanDto) {
    const { page = 1, limit = 10, sort = 'TERBARU' } = query;
    const where = this.buildWhere(query);
    const orderBy = this.buildOrderBy(sort);

    const [data, total] = await Promise.all([
      this.prisma.laporanWarga.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          submitter: { select: { profile: { select: { fullName: true } } } },
          _count: { select: { komentar: true } },
        },
      }),
      this.prisma.laporanWarga.count({ where }),
    ]);

    return {
      data: data.map((l) => ({
        ...l,
        submitterName: l.submitter?.profile?.fullName ?? l.namaPerlapor ?? 'Anonim',
        komentarCount: l._count.komentar,
        submitter: undefined,
        _count: undefined,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findMine(query: QueryLaporanDto, userId: string) {
    const { page = 1, limit = 10, sort = 'TERBARU' } = query;
    const where: Prisma.LaporanWargaWhereInput = {
      ...this.buildWhere(query),
      submittedBy: userId,
    };
    const orderBy = this.buildOrderBy(sort);

    const [data, total] = await Promise.all([
      this.prisma.laporanWarga.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: { _count: { select: { komentar: true } } },
      }),
      this.prisma.laporanWarga.count({ where }),
    ]);

    return {
      data: data.map((l) => ({
        ...l,
        komentarCount: l._count.komentar,
        _count: undefined,
      })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getSummary() {
    const [total, menunggu, diproses, selesai] = await Promise.all([
      this.prisma.laporanWarga.count(),
      this.prisma.laporanWarga.count({ where: { status: 'MENUNGGU' } }),
      this.prisma.laporanWarga.count({ where: { status: 'DIPROSES' } }),
      this.prisma.laporanWarga.count({ where: { status: 'SELESAI' } }),
    ]);
    return { total, menunggu, diproses, selesai };
  }

  async findOne(id: string, userId: string, role: string) {
    const laporan = await this.prisma.laporanWarga.findUnique({
      where: { id },
      include: {
        submitter: { select: { profile: { select: { fullName: true } } } },
        komentar: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { profile: { select: { fullName: true } }, role: true } },
          },
        },
      },
    });

    if (!laporan) throw new NotFoundException('Laporan tidak ditemukan');

    if (role === 'WARGA' && laporan.submittedBy !== userId) {
      throw new ForbiddenException('Anda tidak berhak mengakses laporan ini');
    }

    return {
      ...laporan,
      submitterName: laporan.submitter?.profile?.fullName ?? laporan.namaPerlapor ?? 'Anonim',
      komentar: laporan.komentar.map((k) => ({
        ...k,
        userName: k.user.profile?.fullName ?? 'Admin',
        userRole: k.user.role,
        user: undefined,
      })),
      submitter: undefined,
    };
  }

  async create(dto: CreateLaporanDto, userId: string) {
    const nomorLaporan = await this.generateNomorLaporan();
    return this.prisma.laporanWarga.create({
      data: {
        nomorLaporan,
        judul: dto.judul,
        kategori: dto.kategori,
        prioritas: dto.prioritas ?? 'NORMAL',
        deskripsi: dto.deskripsi,
        lokasi: dto.lokasi,
        status: 'MENUNGGU',
        namaPerlapor: dto.namaPerlapor,
        rtPerlapor: dto.rtPerlapor,
        fotoUrls: dto.fotoUrls ?? [],
        submittedBy: userId,
      },
    });
  }

  async updateStatus(id: string, dto: UpdateStatusLaporanDto, adminId: string) {
    const laporan = await this.prisma.laporanWarga.findUnique({ where: { id } });
    if (!laporan) throw new NotFoundException('Laporan tidak ditemukan');

    const statusLabel: Record<string, string> = {
      MENUNGGU: 'Menunggu',
      DIPROSES: 'Diproses',
      SELESAI: 'Selesai',
    };

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.laporanWarga.update({
        where: { id },
        data: { status: dto.status },
      });

      await tx.laporanKomentar.create({
        data: {
          laporanId: id,
          userId: adminId,
          type: 'STATUS_CHANGE',
          isi: `Status diubah menjadi ${statusLabel[dto.status] ?? dto.status}`,
          statusBaru: dto.status,
        },
      });

      return updated;
    });
  }

  async addKomentar(id: string, dto: CreateKomentarDto, userId: string) {
    const laporan = await this.prisma.laporanWarga.findUnique({ where: { id } });
    if (!laporan) throw new NotFoundException('Laporan tidak ditemukan');

    return this.prisma.laporanKomentar.create({
      data: {
        laporanId: id,
        userId,
        type: 'KOMENTAR',
        isi: dto.isi,
      },
    });
  }
}
