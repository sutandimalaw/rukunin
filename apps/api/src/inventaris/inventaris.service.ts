import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInventarisDto } from './dto/create-inventaris.dto';
import { UpdateInventarisDto } from './dto/update-inventaris.dto';
import { QueryInventarisDto } from './dto/query-inventaris.dto';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { UpdatePeminjamanStatusDto } from './dto/update-peminjaman-status.dto';
import { QueryPeminjamanDto } from './dto/query-peminjaman.dto';

@Injectable()
export class InventarisService {
  constructor(private prisma: PrismaService) {}

  private borrowerSelect = {
    borrower: {
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
    inventaris: {
      select: { id: true, name: true, category: true },
    },
  };

  // ─── Inventaris CRUD ─────────────────────────────────────────────────

  async findAllInventaris(query: QueryInventarisDto) {
    const { page = 1, limit = 20, category, search } = query;
    const where: Record<string, unknown> = {};

    if (category) where.category = category;
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.inventaris.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inventaris.count({ where }),
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

  async findOneInventaris(id: string) {
    const item = await this.prisma.inventaris.findUnique({
      where: { id },
      include: {
        peminjaman: {
          where: { status: { in: ['DISETUJUI', 'DIPINJAM'] } },
          include: this.borrowerSelect,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!item) throw new NotFoundException('Inventaris tidak ditemukan');
    return item;
  }

  async createInventaris(dto: CreateInventarisDto, userId: string) {
    return this.prisma.inventaris.create({
      data: {
        name: dto.name,
        category: dto.category,
        description: dto.description ?? null,
        quantity: dto.quantity ?? 1,
        condition: dto.condition ?? 'BAIK',
        createdBy: userId,
      },
    });
  }

  async updateInventaris(id: string, dto: UpdateInventarisDto) {
    const item = await this.prisma.inventaris.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Inventaris tidak ditemukan');

    return this.prisma.inventaris.update({
      where: { id },
      data: dto,
    });
  }

  async deleteInventaris(id: string) {
    const item = await this.prisma.inventaris.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Inventaris tidak ditemukan');

    // Cek apakah ada peminjaman aktif
    const activeBorrow = await this.prisma.peminjamanInventaris.count({
      where: {
        inventarisId: id,
        status: { in: ['DISETUJUI', 'DIPINJAM'] },
      },
    });
    if (activeBorrow > 0) {
      throw new BadRequestException(
        'Tidak bisa menghapus, masih ada peminjaman aktif',
      );
    }

    return this.prisma.inventaris.delete({ where: { id } });
  }

  // ─── Peminjaman ─────────────────────────────────────────────────────

  async findAllPeminjaman(
    query: QueryPeminjamanDto,
    currentUser: { id: string; role: string },
  ) {
    const { page = 1, limit = 10, status } = query;
    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (currentUser.role !== 'ADMIN') {
      where.borrowerId = currentUser.id;
    }

    const [data, total] = await Promise.all([
      this.prisma.peminjamanInventaris.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: this.borrowerSelect,
      }),
      this.prisma.peminjamanInventaris.count({ where }),
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

  async findOnePeminjaman(
    id: string,
    currentUser: { id: string; role: string },
  ) {
    const peminjaman = await this.prisma.peminjamanInventaris.findUnique({
      where: { id },
      include: this.borrowerSelect,
    });
    if (!peminjaman) throw new NotFoundException('Peminjaman tidak ditemukan');

    if (
      currentUser.role !== 'ADMIN' &&
      peminjaman.borrowerId !== currentUser.id
    ) {
      throw new ForbiddenException('Anda tidak punya akses');
    }

    return peminjaman;
  }

  async createPeminjaman(dto: CreatePeminjamanDto, userId: string) {
    const inventaris = await this.prisma.inventaris.findUnique({
      where: { id: dto.inventarisId },
    });
    if (!inventaris) throw new NotFoundException('Inventaris tidak ditemukan');
    if (!inventaris.isAvailable) {
      throw new BadRequestException('Inventaris sedang tidak tersedia');
    }

    // Cek apakah warga sudah punya peminjaman aktif/menunggu untuk barang yang sama
    const existingRequest = await this.prisma.peminjamanInventaris.findFirst({
      where: {
        inventarisId: dto.inventarisId,
        borrowerId: userId,
        status: { in: ['PENDING', 'DISETUJUI', 'DIPINJAM'] },
      },
    });
    if (existingRequest) {
      throw new BadRequestException(
        `Anda sudah memiliki peminjaman aktif untuk barang ini (status: ${existingRequest.status})`,
      );
    }

    // Cek stok tersedia (stok total - yang sedang dipinjam)
    const borrowed = await this.prisma.peminjamanInventaris.aggregate({
      where: {
        inventarisId: dto.inventarisId,
        status: { in: ['DISETUJUI', 'DIPINJAM'] },
      },
      _sum: { quantity: true },
    });
    const available = inventaris.quantity - (borrowed._sum.quantity ?? 0);
    if (dto.quantity > available) {
      throw new BadRequestException(
        `Stok tersedia hanya ${available} unit`,
      );
    }

    const borrowDate = new Date(dto.borrowDate);
    const returnDate = new Date(dto.returnDate);
    if (returnDate <= borrowDate) {
      throw new BadRequestException(
        'Tanggal kembali harus setelah tanggal pinjam',
      );
    }

    return this.prisma.peminjamanInventaris.create({
      data: {
        inventarisId: dto.inventarisId,
        borrowerId: userId,
        quantity: dto.quantity,
        borrowDate,
        returnDate,
        purpose: dto.purpose,
        status: 'PENDING',
      },
      include: this.borrowerSelect,
    });
  }

  async updatePeminjamanStatus(
    id: string,
    dto: UpdatePeminjamanStatusDto,
    adminId: string,
  ) {
    const peminjaman = await this.prisma.peminjamanInventaris.findUnique({
      where: { id },
    });
    if (!peminjaman) throw new NotFoundException('Peminjaman tidak ditemukan');

    // Validasi transisi status
    const validTransitions: Record<string, string[]> = {
      PENDING: ['DISETUJUI', 'DITOLAK'],
      DISETUJUI: ['DIPINJAM', 'DITOLAK'],
      DIPINJAM: ['DIKEMBALIKAN'],
    };

    const allowed = validTransitions[peminjaman.status] ?? [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Tidak bisa mengubah status dari ${peminjaman.status} ke ${dto.status}`,
      );
    }

    return this.prisma.peminjamanInventaris.update({
      where: { id },
      data: {
        status: dto.status,
        adminNotes: dto.adminNotes ?? peminjaman.adminNotes,
        processedBy: adminId,
        processedAt: new Date(),
        actualReturn: dto.status === 'DIKEMBALIKAN' ? new Date() : undefined,
      },
      include: this.borrowerSelect,
    });
  }

  async cancelPeminjaman(
    id: string,
    currentUser: { id: string; role: string },
  ) {
    const peminjaman = await this.prisma.peminjamanInventaris.findUnique({
      where: { id },
    });
    if (!peminjaman) throw new NotFoundException('Peminjaman tidak ditemukan');

    if (
      currentUser.role !== 'ADMIN' &&
      peminjaman.borrowerId !== currentUser.id
    ) {
      throw new ForbiddenException('Anda tidak punya akses');
    }

    if (peminjaman.status !== 'PENDING') {
      throw new BadRequestException(
        'Hanya peminjaman berstatus PENDING yang bisa dibatalkan',
      );
    }

    return this.prisma.peminjamanInventaris.delete({ where: { id } });
  }
}
