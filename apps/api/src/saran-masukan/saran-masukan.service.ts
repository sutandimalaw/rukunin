import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaranMasukanDto } from './dto/create-saran-masukan.dto';
import { RespondSaranMasukanDto } from './dto/respond-saran-masukan.dto';
import { QuerySaranMasukanDto } from './dto/query-saran-masukan.dto';

@Injectable()
export class SaranMasukanService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QuerySaranMasukanDto) {
    const { page = 1, limit = 10, status, category } = query;
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const [data, total] = await Promise.all([
      this.prisma.saranMasukan.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          submitter: {
            select: { id: true, email: true, profile: { select: { fullName: true } } },
          },
          responder: {
            select: { id: true, email: true, profile: { select: { fullName: true } } },
          },
        },
      }),
      this.prisma.saranMasukan.count({ where }),
    ]);

    // Sembunyikan identitas submitter jika anonim
    const sanitized = data.map((s) => ({
      ...s,
      submitter: s.isAnonymous ? null : s.submitter,
      submittedBy: s.isAnonymous ? null : s.submittedBy,
    }));

    return {
      data: sanitized,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findMine(query: QuerySaranMasukanDto, userId: string) {
    const { page = 1, limit = 10, status } = query;
    const where: Record<string, unknown> = { submittedBy: userId };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.saranMasukan.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.saranMasukan.count({ where }),
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

  async create(dto: CreateSaranMasukanDto, userId: string) {
    return this.prisma.saranMasukan.create({
      data: {
        category: dto.category,
        subject: dto.subject,
        content: dto.content,
        isAnonymous: dto.isAnonymous ?? false,
        submittedBy: dto.isAnonymous ? null : userId,
      },
    });
  }

  async respond(id: string, dto: RespondSaranMasukanDto, adminId: string) {
    const saran = await this.prisma.saranMasukan.findUnique({ where: { id } });
    if (!saran) throw new NotFoundException('Saran tidak ditemukan');

    return this.prisma.saranMasukan.update({
      where: { id },
      data: {
        status: dto.status,
        adminResponse: dto.adminResponse ?? saran.adminResponse,
        respondedBy: adminId,
        respondedAt: new Date(),
      },
    });
  }

  async getSummary() {
    const [baru, dibaca, ditanggapi] = await Promise.all([
      this.prisma.saranMasukan.count({ where: { status: 'BARU' } }),
      this.prisma.saranMasukan.count({ where: { status: 'DIBACA' } }),
      this.prisma.saranMasukan.count({ where: { status: 'DITANGGAPI' } }),
    ]);
    return { baru, dibaca, ditanggapi, total: baru + dibaca + ditanggapi };
  }
}
