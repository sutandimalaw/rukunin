import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLayananWargaDto } from './dto/create-layanan-warga.dto';
import { UpdateLayananStatusDto } from './dto/update-layanan-status.dto';
import { QueryLayananWargaDto } from './dto/query-layanan-warga.dto';

@Injectable()
export class LayananWargaService {
  constructor(private prisma: PrismaService) {}

  private requesterSelect = {
    requester: {
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

  async findAll(
    query: QueryLayananWargaDto,
    currentUser: { id: string; role: string },
  ) {
    const { page = 1, limit = 10, type, status } = query;
    const where: { type?: string; status?: string; requestedBy?: string } = {};

    if (type) where.type = type;
    if (status) where.status = status;

    // Warga hanya lihat layanan miliknya sendiri
    if (currentUser.role !== 'ADMIN') {
      where.requestedBy = currentUser.id;
    }

    const [data, total] = await Promise.all([
      this.prisma.layananWarga.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.requesterSelect,
      }),
      this.prisma.layananWarga.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, currentUser: { id: string; role: string }) {
    const layanan = await this.prisma.layananWarga.findUnique({
      where: { id },
      include: this.requesterSelect,
    });

    if (!layanan) {
      throw new NotFoundException('Layanan tidak ditemukan');
    }

    // Warga hanya bisa lihat miliknya
    if (
      currentUser.role !== 'ADMIN' &&
      layanan.requestedBy !== currentUser.id
    ) {
      throw new ForbiddenException('Anda tidak punya akses ke layanan ini');
    }

    return layanan;
  }

  async create(dto: CreateLayananWargaDto, userId: string) {
    return this.prisma.layananWarga.create({
      data: {
        type: dto.type,
        subject: dto.subject,
        description: dto.description,
        purpose: dto.purpose ?? null,
        location: dto.location ?? null,
        status: 'PENDING',
        requestedBy: userId,
      },
      include: this.requesterSelect,
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateLayananStatusDto,
    adminId: string,
  ) {
    const layanan = await this.prisma.layananWarga.findUnique({ where: { id } });
    if (!layanan) throw new NotFoundException('Layanan tidak ditemukan');

    // Tidak boleh balik dari SELESAI atau DITOLAK
    if (layanan.status === 'SELESAI' || layanan.status === 'DITOLAK') {
      throw new BadRequestException(
        `Layanan sudah ${layanan.status}, tidak bisa diubah lagi`,
      );
    }

    return this.prisma.layananWarga.update({
      where: { id },
      data: {
        status: dto.status,
        adminNotes: dto.adminNotes ?? layanan.adminNotes,
        processedBy: adminId,
        processedAt: new Date(),
      },
      include: this.requesterSelect,
    });
  }

  async remove(id: string, currentUser: { id: string; role: string }) {
    const layanan = await this.prisma.layananWarga.findUnique({ where: { id } });
    if (!layanan) throw new NotFoundException('Layanan tidak ditemukan');

    // Warga hanya bisa hapus miliknya & yang masih PENDING
    if (currentUser.role !== 'ADMIN') {
      if (layanan.requestedBy !== currentUser.id) {
        throw new ForbiddenException('Anda tidak punya akses');
      }
      if (layanan.status !== 'PENDING') {
        throw new BadRequestException(
          'Hanya layanan dengan status PENDING yang bisa dibatalkan',
        );
      }
    }

    return this.prisma.layananWarga.delete({ where: { id } });
  }
}
