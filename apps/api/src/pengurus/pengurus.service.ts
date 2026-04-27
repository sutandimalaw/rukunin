import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePengurusDto } from './dto/create-pengurus.dto';
import { UpdatePengurusDto } from './dto/update-pengurus.dto';
import { QueryPengurusDto } from './dto/query-pengurus.dto';

type CurrentUser = { id: string; role: string };

@Injectable()
export class PengurusService {
  constructor(private prisma: PrismaService) {}

  private userInclude = {
    user: {
      select: {
        id: true,
        email: true,
        profile: { select: { fullName: true, avatarUrl: true } },
      },
    },
  };

  async findAll(query: QueryPengurusDto) {
    const { active, periodeStart } = query;

    const where: { isActive?: boolean; periodeStart?: number } = {};
    if (active !== undefined) where.isActive = active;
    if (periodeStart !== undefined) where.periodeStart = periodeStart;

    return this.prisma.pengurus.findMany({
      where,
      orderBy: [
        { posisi: 'asc' },
        { urutan: 'asc' },
        { createdAt: 'asc' },
      ],
      include: this.userInclude,
    });
  }

  async findOne(id: string) {
    const pengurus = await this.prisma.pengurus.findUnique({
      where: { id },
      include: {
        ...this.userInclude,
        creator: {
          select: {
            id: true,
            email: true,
            profile: { select: { fullName: true } },
          },
        },
      },
    });

    if (!pengurus) {
      throw new NotFoundException('Pengurus tidak ditemukan');
    }

    return pengurus;
  }

  async create(dto: CreatePengurusDto, currentUser: CurrentUser) {
    this.assertAdmin(currentUser);
    this.validatePosisi(dto.posisi, dto.customPosisi);
    this.validatePeriode(dto.periodeStart, dto.periodeEnd);

    if (dto.userId) {
      await this.assertUserExists(dto.userId);
    }

    return this.prisma.pengurus.create({
      data: {
        posisi: dto.posisi,
        customPosisi: dto.posisi === 'LAINNYA' ? dto.customPosisi : null,
        urutan: dto.urutan ?? 0,
        userId: dto.userId ?? null,
        fullName: dto.fullName,
        whatsapp: dto.whatsapp ?? null,
        photoUrl: dto.photoUrl ?? null,
        periodeStart: dto.periodeStart,
        periodeEnd: dto.periodeEnd,
        isActive: dto.isActive ?? true,
        notes: dto.notes ?? null,
        createdBy: currentUser.id,
      },
      include: this.userInclude,
    });
  }

  async update(id: string, dto: UpdatePengurusDto, currentUser: CurrentUser) {
    this.assertAdmin(currentUser);

    const existing = await this.prisma.pengurus.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Pengurus tidak ditemukan');

    const nextPosisi = dto.posisi ?? existing.posisi;
    const nextCustomPosisi =
      dto.customPosisi !== undefined ? dto.customPosisi : existing.customPosisi;
    this.validatePosisi(nextPosisi, nextCustomPosisi);

    const nextStart = dto.periodeStart ?? existing.periodeStart;
    const nextEnd = dto.periodeEnd ?? existing.periodeEnd;
    this.validatePeriode(nextStart, nextEnd);

    if (dto.userId) {
      await this.assertUserExists(dto.userId);
    }

    return this.prisma.pengurus.update({
      where: { id },
      data: {
        ...(dto.posisi !== undefined && { posisi: dto.posisi }),
        customPosisi: nextPosisi === 'LAINNYA' ? nextCustomPosisi : null,
        ...(dto.urutan !== undefined && { urutan: dto.urutan }),
        ...(dto.userId !== undefined && { userId: dto.userId }),
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.whatsapp !== undefined && { whatsapp: dto.whatsapp }),
        ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
        ...(dto.periodeStart !== undefined && { periodeStart: dto.periodeStart }),
        ...(dto.periodeEnd !== undefined && { periodeEnd: dto.periodeEnd }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      include: this.userInclude,
    });
  }

  async remove(id: string, currentUser: CurrentUser) {
    this.assertAdmin(currentUser);

    const existing = await this.prisma.pengurus.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Pengurus tidak ditemukan');

    await this.prisma.pengurus.delete({ where: { id } });
    return { success: true };
  }

  // ─── helpers ─────────────────────────────────────────────────────────────

  private assertAdmin(currentUser: CurrentUser) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Hanya admin yang dapat melakukan aksi ini');
    }
  }

  private validatePosisi(posisi: string, customPosisi?: string | null) {
    if (posisi === 'LAINNYA' && !customPosisi?.trim()) {
      throw new BadRequestException(
        'customPosisi wajib diisi kalau posisi LAINNYA',
      );
    }
  }

  private validatePeriode(start: number, end: number) {
    if (end < start) {
      throw new BadRequestException(
        'periodeEnd harus >= periodeStart',
      );
    }
  }

  private async assertUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new BadRequestException('User tidak ditemukan');
  }
}
