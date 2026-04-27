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
import { UmkmService } from './umkm.service';
import { CreateUmkmUsahaDto } from './dto/create-umkm-usaha.dto';
import { UpdateUmkmUsahaDto } from './dto/update-umkm-usaha.dto';
import { QueryUmkmDto } from './dto/query-umkm.dto';
import { UpdateUsahaStatusDto } from './dto/update-usaha-status.dto';
import { CreateUmkmProdukDto } from './dto/create-umkm-produk.dto';
import { UpdateUmkmProdukDto } from './dto/update-umkm-produk.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('umkm')
export class UmkmController {
  constructor(private readonly service: UmkmService) {}

  // ─── USAHA ───────────────────────────────────────────────────────────────

  @Get()
  findAll(
    @Query() query: QueryUmkmDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.findAllUsaha(query, user);
  }

  @Get('my')
  findMy(@CurrentUser() user: { id: string }) {
    return this.service.findMyUsaha(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOneUsaha(id);
  }

  @Post()
  create(
    @Body() dto: CreateUmkmUsahaDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.createUsaha(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUmkmUsahaDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.updateUsaha(id, dto, user);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUsahaStatusDto,
  ) {
    return this.service.updateUsahaStatus(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.deleteUsaha(id, user);
  }

  // ─── PRODUK ──────────────────────────────────────────────────────────────

  @Get(':id/produk')
  findProduk(@Param('id') id: string) {
    return this.service.findProdukByUsaha(id);
  }

  @Post(':id/produk')
  createProduk(
    @Param('id') usahaId: string,
    @Body() dto: CreateUmkmProdukDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.createProduk(usahaId, dto, user);
  }

  @Patch('produk/:produkId')
  updateProduk(
    @Param('produkId') produkId: string,
    @Body() dto: UpdateUmkmProdukDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.updateProduk(produkId, dto, user);
  }

  @Delete('produk/:produkId')
  deleteProduk(
    @Param('produkId') produkId: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.deleteProduk(produkId, user);
  }
}
