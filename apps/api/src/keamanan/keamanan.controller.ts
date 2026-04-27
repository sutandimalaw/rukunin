import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { KeamananService } from './keamanan.service';
import { CreatePetugasDto } from './dto/create-petugas.dto';
import { UpdatePetugasDto } from './dto/update-petugas.dto';
import { CreateBukuTamuDto } from './dto/create-buku-tamu.dto';
import { QueryBukuTamuDto } from './dto/query-buku-tamu.dto';
import { CreateLaporanInsidenDto } from './dto/create-laporan-insiden.dto';
import { UpdateInsidenStatusDto } from './dto/update-insiden-status.dto';
import { QueryLaporanInsidenDto } from './dto/query-laporan-insiden.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('keamanan')
export class KeamananController {
  constructor(private readonly service: KeamananService) {}

  // ─── Summary ────────────────────────────────────────────────────────
  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }

  // ─── Petugas ────────────────────────────────────────────────────────
  @Get('petugas')
  findAllPetugas() {
    return this.service.findAllPetugas();
  }

  @Post('petugas')
  createPetugas(
    @Body() dto: CreatePetugasDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.createPetugas(dto, user.id);
  }

  @Patch('petugas/:id')
  updatePetugas(@Param('id') id: string, @Body() dto: UpdatePetugasDto) {
    return this.service.updatePetugas(id, dto);
  }

  @Delete('petugas/:id')
  deletePetugas(@Param('id') id: string) {
    return this.service.deletePetugas(id);
  }

  // ─── Buku Tamu ──────────────────────────────────────────────────────
  @Get('tamu')
  findAllTamu(@Query() query: QueryBukuTamuDto) {
    return this.service.findAllTamu(query);
  }

  @Post('tamu')
  createTamu(
    @Body() dto: CreateBukuTamuDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.createTamu(dto, user.id);
  }

  @Patch('tamu/:id/checkout')
  checkOutTamu(@Param('id') id: string) {
    return this.service.checkOutTamu(id);
  }

  // ─── Insiden ────────────────────────────────────────────────────────
  @Get('insiden')
  findAllInsiden(
    @Query() query: QueryLaporanInsidenDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.findAllInsiden(query, user);
  }

  @Post('insiden')
  createInsiden(
    @Body() dto: CreateLaporanInsidenDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.createInsiden(dto, user.id);
  }

  @Patch('insiden/:id/status')
  updateInsidenStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInsidenStatusDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.updateInsidenStatus(id, dto, user.id);
  }

  @Delete('insiden/:id')
  cancelInsiden(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.cancelInsiden(id, user);
  }
}
