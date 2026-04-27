import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUmkmUsahaDto } from './dto/create-umkm-usaha.dto';
import { UpdateUmkmUsahaDto } from './dto/update-umkm-usaha.dto';
import { QueryUmkmDto } from './dto/query-umkm.dto';
import { UpdateUsahaStatusDto } from './dto/update-usaha-status.dto';
import { CreateUmkmProdukDto } from './dto/create-umkm-produk.dto';
import { UpdateUmkmProdukDto } from './dto/update-umkm-produk.dto';

@Injectable()
export class UmkmService {
  constructor(private prisma: PrismaService) {}

  private ownerSelect = {
    owner: {
      select: {
        id: true,
        email: true,
        profile: { select: { fullName: true } },
      },
    },
  };

  // ─── USAHA ───────────────────────────────────────────────────────────────

  async findAllUsaha(
    query: QueryUmkmDto,
    currentUser: { id: string; role: string },
  ) {
    const { page = 1, limit = 12, category, status, search } = query;

    const where: {
      category?: string;
      status?: string;
      isActive?: boolean;
      name?: { contains: string; mode: 'insensitive' };
      OR?: { ownerId?: string; status?: string }[];
    } = {};

    if (category) where.category = category;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    if (currentUser.role === 'ADMIN') {
      // Admin bisa filter by status atau lihat semua
      if (status) where.status = status;
    } else {
      // Warga hanya lihat ACTIVE + miliknya sendiri
      where.OR = [
        { status: 'ACTIVE', ...(where.isActive !== undefined ? { isActive: true } : {}) },
        { ownerId: currentUser.id },
      ];
      // Hapus filter isActive dari where karena sudah di OR
    }

    const [data, total] = await Promise.all([
      this.prisma.umkmUsaha.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          ...this.ownerSelect,
          _count: { select: { products: true } },
        },
      }),
      this.prisma.umkmUsaha.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOneUsaha(id: string) {
    const usaha = await this.prisma.umkmUsaha.findUnique({
      where: { id },
      include: {
        ...this.ownerSelect,
        products: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!usaha) throw new NotFoundException('Usaha tidak ditemukan');
    return usaha;
  }

  async findMyUsaha(userId: string) {
    return this.prisma.umkmUsaha.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { products: true } },
        products: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  async createUsaha(dto: CreateUmkmUsahaDto, userId: string) {
    return this.prisma.umkmUsaha.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        address: dto.address ?? null,
        whatsapp: dto.whatsapp,
        status: 'PENDING',
        ownerId: userId,
      },
      include: this.ownerSelect,
    });
  }

  async updateUsaha(
    id: string,
    dto: UpdateUmkmUsahaDto,
    currentUser: { id: string; role: string },
  ) {
    const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id } });
    if (!usaha) throw new NotFoundException('Usaha tidak ditemukan');
    if (currentUser.role !== 'ADMIN' && usaha.ownerId !== currentUser.id) {
      throw new ForbiddenException('Anda tidak punya akses ke usaha ini');
    }
    return this.prisma.umkmUsaha.update({
      where: { id },
      data: dto,
      include: this.ownerSelect,
    });
  }

  async updateUsahaStatus(id: string, dto: UpdateUsahaStatusDto) {
    const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id } });
    if (!usaha) throw new NotFoundException('Usaha tidak ditemukan');
    return this.prisma.umkmUsaha.update({
      where: { id },
      data: {
        status: dto.status,
        adminNotes: dto.adminNotes ?? usaha.adminNotes,
      },
      include: this.ownerSelect,
    });
  }

  async deleteUsaha(
    id: string,
    currentUser: { id: string; role: string },
  ) {
    const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id } });
    if (!usaha) throw new NotFoundException('Usaha tidak ditemukan');
    if (currentUser.role !== 'ADMIN') {
      if (usaha.ownerId !== currentUser.id) {
        throw new ForbiddenException('Anda tidak punya akses');
      }
      if (usaha.status === 'ACTIVE') {
        throw new BadRequestException(
          'Nonaktifkan usaha terlebih dahulu sebelum menghapus',
        );
      }
    }
    return this.prisma.umkmUsaha.delete({ where: { id } });
  }

  // ─── PRODUK ──────────────────────────────────────────────────────────────

  async findProdukByUsaha(usahaId: string) {
    const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id: usahaId } });
    if (!usaha) throw new NotFoundException('Usaha tidak ditemukan');
    return this.prisma.umkmProduk.findMany({
      where: { usahaId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createProduk(
    usahaId: string,
    dto: CreateUmkmProdukDto,
    currentUser: { id: string; role: string },
  ) {
    const usaha = await this.prisma.umkmUsaha.findUnique({ where: { id: usahaId } });
    if (!usaha) throw new NotFoundException('Usaha tidak ditemukan');
    if (currentUser.role !== 'ADMIN' && usaha.ownerId !== currentUser.id) {
      throw new ForbiddenException('Hanya pemilik usaha yang bisa menambah produk');
    }
    return this.prisma.umkmProduk.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        price: dto.price,
        type: dto.type,
        usahaId,
      },
    });
  }

  async updateProduk(
    produkId: string,
    dto: UpdateUmkmProdukDto,
    currentUser: { id: string; role: string },
  ) {
    const produk = await this.prisma.umkmProduk.findUnique({
      where: { id: produkId },
      include: { usaha: true },
    });
    if (!produk) throw new NotFoundException('Produk tidak ditemukan');
    if (currentUser.role !== 'ADMIN' && produk.usaha.ownerId !== currentUser.id) {
      throw new ForbiddenException('Hanya pemilik usaha yang bisa mengubah produk');
    }
    return this.prisma.umkmProduk.update({ where: { id: produkId }, data: dto });
  }

  async deleteProduk(
    produkId: string,
    currentUser: { id: string; role: string },
  ) {
    const produk = await this.prisma.umkmProduk.findUnique({
      where: { id: produkId },
      include: { usaha: true },
    });
    if (!produk) throw new NotFoundException('Produk tidak ditemukan');
    if (currentUser.role !== 'ADMIN' && produk.usaha.ownerId !== currentUser.id) {
      throw new ForbiddenException('Hanya pemilik usaha yang bisa menghapus produk');
    }
    return this.prisma.umkmProduk.delete({ where: { id: produkId } });
  }
}
