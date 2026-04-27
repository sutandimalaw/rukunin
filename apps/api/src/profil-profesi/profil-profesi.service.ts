import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertProfilProfesiDto } from './dto/upsert-profil-profesi.dto';
import { QueryProfilProfesiDto } from './dto/query-profil-profesi.dto';

@Injectable()
export class ProfilProfesiService {
  constructor(private prisma: PrismaService) {}

  private userSelect = {
    user: {
      select: {
        id: true,
        email: true,
        profile: { select: { fullName: true, avatarUrl: true } },
      },
    },
  };

  async findAll(query: QueryProfilProfesiDto) {
    const { page = 1, limit = 12, category, search } = query;

    const where: object = {
      isPublished: true,
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { jobTitle: { contains: search, mode: 'insensitive' } },
              { skills: { contains: search, mode: 'insensitive' } },
              {
                user: {
                  profile: { fullName: { contains: search, mode: 'insensitive' } },
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.profilProfesi.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: this.userSelect,
      }),
      this.prisma.profilProfesi.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAllAdmin(query: QueryProfilProfesiDto) {
    const { page = 1, limit = 12, category, search } = query;

    const where: object = {
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { jobTitle: { contains: search, mode: 'insensitive' } },
              { skills: { contains: search, mode: 'insensitive' } },
              {
                user: {
                  profile: { fullName: { contains: search, mode: 'insensitive' } },
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.profilProfesi.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: this.userSelect,
      }),
      this.prisma.profilProfesi.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.profilProfesi.findUnique({
      where: { id },
      include: this.userSelect,
    });
    if (!item) throw new NotFoundException('Profil profesi tidak ditemukan');
    return item;
  }

  async findMine(userId: string) {
    return this.prisma.profilProfesi.findUnique({
      where: { userId },
      include: this.userSelect,
    });
  }

  async upsert(userId: string, dto: UpsertProfilProfesiDto) {
    const { category, jobTitle, skills, bio, whatsapp, isPublished } = dto;
    return this.prisma.profilProfesi.upsert({
      where: { userId },
      create: {
        userId,
        category: category as any,
        jobTitle,
        skills,
        bio,
        whatsapp,
        isPublished: isPublished ?? true,
      },
      update: {
        category: category as any,
        jobTitle,
        skills,
        bio,
        whatsapp,
        ...(isPublished !== undefined ? { isPublished } : {}),
      },
      include: this.userSelect,
    });
  }

  async remove(userId: string) {
    const existing = await this.prisma.profilProfesi.findUnique({
      where: { userId },
    });
    if (!existing) throw new NotFoundException('Profil profesi tidak ditemukan');
    await this.prisma.profilProfesi.delete({ where: { userId } });
    return { message: 'Profil profesi berhasil dihapus' };
  }
}
