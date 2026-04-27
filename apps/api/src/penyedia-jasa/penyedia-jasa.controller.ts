import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PenyediaJasaService } from './penyedia-jasa.service';
import { CreatePenyediaJasaDto } from './dto/create-penyedia-jasa.dto';
import { UpdatePenyediaJasaDto } from './dto/update-penyedia-jasa.dto';
import { UpdatePenyediaJasaStatusDto } from './dto/update-status.dto';
import { QueryPenyediaJasaDto } from './dto/query-penyedia-jasa.dto';
import { UpsertReviewDto } from './dto/upsert-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('penyedia-jasa')
export class PenyediaJasaController {
  constructor(private readonly service: PenyediaJasaService) {}

  // ─── ENTRY ───────────────────────────────────────────────────────────────

  @Get()
  findAll(
    @Query() query: QueryPenyediaJasaDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.findAll(query, user);
  }

  @Get('saya')
  findMy(@CurrentUser() user: { id: string }) {
    return this.service.findMy(user.id);
  }

  @Delete('reviews/:reviewId')
  adminDeleteReview(
    @Param('reviewId') reviewId: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.adminDeleteReview(reviewId, user);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.findOne(id, user);
  }

  @Post()
  create(
    @Body() dto: CreatePenyediaJasaDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePenyediaJasaDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.update(id, dto, user);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePenyediaJasaStatusDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.updateStatus(id, dto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.remove(id, user);
  }

  // ─── REVIEWS ─────────────────────────────────────────────────────────────

  @Get(':id/reviews')
  listReviews(@Param('id') id: string) {
    return this.service.listReviews(id);
  }

  @Put(':id/reviews')
  upsertReview(
    @Param('id') id: string,
    @Body() dto: UpsertReviewDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.upsertReview(id, dto, user.id);
  }

  @Delete(':id/reviews/saya')
  deleteMyReview(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.deleteMyReview(id, user.id);
  }
}
