import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePenyediaJasaDto } from './dto/create-penyedia-jasa.dto';
import { UpdatePenyediaJasaDto } from './dto/update-penyedia-jasa.dto';
import { UpdatePenyediaJasaStatusDto } from './dto/update-status.dto';
import { QueryPenyediaJasaDto } from './dto/query-penyedia-jasa.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';

type CurrentUser = { id: string; role: string };

@Injectable()
export class PenyediaJasaService {
  constructor(private prisma: PrismaService) {}

  private submitterSelect = {
    submitter: {
      select: {
        id: true,
        email: true,
        profile: { select: { fullName: true } },
      },
    },
  };

  private reviewerSelect = {
    reviewer: {
      select: {
        id: true,
        email: true,
        profile: { select: { fullName: true } },
      },
    },
  };

  // ─── ENTRY CRUD ──────────────────────────────────────────────────────────

  async findAll(query: QueryPenyediaJasaDto, currentUser: CurrentUser) {
    const { page = 1, limit = 12, category, status, search } = query;

    const where: {
      category?: string;
      status?: string;
      personName?: { contains: string; mode: 'insensitive' };
      OR?: { status?: string; submittedBy?: string }[];
    } = {};

    if (category) where.category = category;
    if (search) where.personName = { contains: search, mode: 'insensitive' };

    if (currentUser.role === 'ADMIN') {
      if (status) where.status = status;
    } else {
      // Warga: hanya ACTIVE atau milik sendiri
      where.OR = [
        { status: 'ACTIVE' },
        { submittedBy: currentUser.id },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.penyediaJasa.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: this.submitterSelect,
      }),
      this.prisma.penyediaJasa.count({ where }),
    ]);

    const withAggregate = await this.attachAggregate(data);

    return {
      data: withAggregate,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findMy(userId: string) {
    const data = await this.prisma.penyediaJasa.findMany({
      where: { submittedBy: userId },
      orderBy: { createdAt: 'desc' },
      include: this.submitterSelect,
    });
    return this.attachAggregate(data);
  }

  async findOne(id: string, currentUser: CurrentUser) {
    const item = await this.prisma.penyediaJasa.findUnique({
      where: { id },
      include: {
        ...this.submitterSelect,
        reviews: {
          orderBy: { createdAt: 'desc' },
          include: this.reviewerSelect,
        },
      },
    });
    if (!item) throw new NotFoundException('Penyedia jasa tidak ditemukan');

    // Warga: hanya bisa lihat ACTIVE atau miliknya
    if (
      currentUser.role !== 'ADMIN' &&
      item.status !== 'ACTIVE' &&
      item.submittedBy !== currentUser.id
    ) {
      throw new ForbiddenException('Anda tidak punya akses ke entry ini');
    }

    const ratingCount = item.reviews.length;
    const averageRating =
      ratingCount > 0
        ? item.reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
        : null;

    return { ...item, averageRating, reviewCount: ratingCount };
  }

  async create(dto: CreatePenyediaJasaDto, userId: string) {
    return this.prisma.penyediaJasa.create({
      data: {
        personName: dto.personName,
        category: dto.category,
        whatsapp: dto.whatsapp ?? null,
        description: dto.description ?? null,
        area: dto.area ?? null,
        status: 'PENDING',
        submittedBy: userId,
      },
      include: this.submitterSelect,
    });
  }

  async update(
    id: string,
    dto: UpdatePenyediaJasaDto,
    currentUser: CurrentUser,
  ) {
    const item = await this.prisma.penyediaJasa.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Penyedia jasa tidak ditemukan');
    if (currentUser.role !== 'ADMIN' && item.submittedBy !== currentUser.id) {
      throw new ForbiddenException('Anda tidak punya akses ke entry ini');
    }
    return this.prisma.penyediaJasa.update({
      where: { id },
      data: dto,
      include: this.submitterSelect,
    });
  }

  async updateStatus(
    id: string,
    dto: UpdatePenyediaJasaStatusDto,
    currentUser: CurrentUser,
  ) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Hanya admin yang bisa ubah status');
    }
    const item = await this.prisma.penyediaJasa.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Penyedia jasa tidak ditemukan');
    return this.prisma.penyediaJasa.update({
      where: { id },
      data: {
        status: dto.status,
        adminNotes: dto.adminNotes ?? item.adminNotes,
      },
      include: this.submitterSelect,
    });
  }

  async remove(id: string, currentUser: CurrentUser) {
    const item = await this.prisma.penyediaJasa.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Penyedia jasa tidak ditemukan');
    if (currentUser.role !== 'ADMIN' && item.submittedBy !== currentUser.id) {
      throw new ForbiddenException('Anda tidak punya akses');
    }
    return this.prisma.penyediaJasa.delete({ where: { id } });
  }

  // ─── REVIEWS ─────────────────────────────────────────────────────────────

  async listReviews(penyediaJasaId: string) {
    const exists = await this.prisma.penyediaJasa.findUnique({
      where: { id: penyediaJasaId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Penyedia jasa tidak ditemukan');
    return this.prisma.penyediaJasaReview.findMany({
      where: { penyediaJasaId },
      orderBy: { createdAt: 'desc' },
      include: this.reviewerSelect,
    });
  }

  async upsertReview(
    penyediaJasaId: string,
    dto: UpsertReviewDto,
    userId: string,
  ) {
    const target = await this.prisma.penyediaJasa.findUnique({
      where: { id: penyediaJasaId },
    });
    if (!target) throw new NotFoundException('Penyedia jasa tidak ditemukan');
    if (target.status !== 'ACTIVE') {
      throw new ForbiddenException(
        'Hanya penyedia jasa yang sudah aktif yang bisa direview',
      );
    }

    return this.prisma.penyediaJasaReview.upsert({
      where: {
        penyediaJasaId_reviewerId: {
          penyediaJasaId,
          reviewerId: userId,
        },
      },
      create: {
        penyediaJasaId,
        reviewerId: userId,
        rating: dto.rating,
        comment: dto.comment ?? null,
      },
      update: {
        rating: dto.rating,
        comment: dto.comment ?? null,
      },
      include: this.reviewerSelect,
    });
  }

  async deleteMyReview(penyediaJasaId: string, userId: string) {
    const review = await this.prisma.penyediaJasaReview.findUnique({
      where: {
        penyediaJasaId_reviewerId: {
          penyediaJasaId,
          reviewerId: userId,
        },
      },
    });
    if (!review) throw new NotFoundException('Review tidak ditemukan');
    return this.prisma.penyediaJasaReview.delete({ where: { id: review.id } });
  }

  async adminDeleteReview(reviewId: string, currentUser: CurrentUser) {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Hanya admin yang bisa moderasi review');
    }
    const review = await this.prisma.penyediaJasaReview.findUnique({
      where: { id: reviewId },
    });
    if (!review) throw new NotFoundException('Review tidak ditemukan');
    return this.prisma.penyediaJasaReview.delete({ where: { id: reviewId } });
  }

  // ─── HELPER ──────────────────────────────────────────────────────────────

  private async attachAggregate<T extends { id: string }>(items: T[]) {
    if (items.length === 0) return [];
    const aggregates = await this.prisma.penyediaJasaReview.groupBy({
      by: ['penyediaJasaId'],
      where: { penyediaJasaId: { in: items.map((i) => i.id) } },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const map = new Map(
      aggregates.map((a) => [
        a.penyediaJasaId,
        { averageRating: a._avg.rating, reviewCount: a._count.rating },
      ]),
    );
    return items.map((i) => ({
      ...i,
      averageRating: map.get(i.id)?.averageRating ?? null,
      reviewCount: map.get(i.id)?.reviewCount ?? 0,
    }));
  }
}
