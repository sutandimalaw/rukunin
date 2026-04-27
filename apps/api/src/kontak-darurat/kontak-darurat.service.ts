import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKontakDaruratDto } from './dto/create-kontak-darurat.dto';
import { UpdateKontakDaruratDto } from './dto/update-kontak-darurat.dto';
import { QueryKontakDaruratDto } from './dto/query-kontak-darurat.dto';

@Injectable()
export class KontakDaruratService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryKontakDaruratDto) {
    const where: Record<string, unknown> = { isActive: true };
    if (query.category) where.category = query.category;

    return this.prisma.kontakDarurat.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findAllAdmin(query: QueryKontakDaruratDto) {
    const where: Record<string, unknown> = {};
    if (query.category) where.category = query.category;

    return this.prisma.kontakDarurat.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async create(dto: CreateKontakDaruratDto, userId: string) {
    return this.prisma.kontakDarurat.create({
      data: {
        name: dto.name,
        category: dto.category,
        phoneNumber: dto.phoneNumber,
        address: dto.address ?? null,
        isActive: dto.isActive ?? true,
        sortOrder: dto.sortOrder ?? 0,
        createdBy: userId,
      },
    });
  }

  async update(id: string, dto: UpdateKontakDaruratDto) {
    const item = await this.prisma.kontakDarurat.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Kontak darurat tidak ditemukan');
    return this.prisma.kontakDarurat.update({ where: { id }, data: dto });
  }

  async delete(id: string) {
    const item = await this.prisma.kontakDarurat.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Kontak darurat tidak ditemukan');
    return this.prisma.kontakDarurat.delete({ where: { id } });
  }
}
