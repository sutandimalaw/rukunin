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
import { InventarisService } from './inventaris.service';
import { CreateInventarisDto } from './dto/create-inventaris.dto';
import { UpdateInventarisDto } from './dto/update-inventaris.dto';
import { QueryInventarisDto } from './dto/query-inventaris.dto';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { UpdatePeminjamanStatusDto } from './dto/update-peminjaman-status.dto';
import { QueryPeminjamanDto } from './dto/query-peminjaman.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('inventaris')
export class InventarisController {
  constructor(private readonly service: InventarisService) {}

  // ─── Inventaris CRUD (admin) ──────────────────────────────────────

  @Get()
  findAllInventaris(@Query() query: QueryInventarisDto) {
    return this.service.findAllInventaris(query);
  }

  @Get(':id')
  findOneInventaris(@Param('id') id: string) {
    return this.service.findOneInventaris(id);
  }

  @Post()
  createInventaris(
    @Body() dto: CreateInventarisDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.createInventaris(dto, user.id);
  }

  @Patch(':id')
  updateInventaris(
    @Param('id') id: string,
    @Body() dto: UpdateInventarisDto,
  ) {
    return this.service.updateInventaris(id, dto);
  }

  @Delete(':id')
  deleteInventaris(@Param('id') id: string) {
    return this.service.deleteInventaris(id);
  }

  // ─── Peminjaman ───────────────────────────────────────────────────

  @Get('peminjaman/list')
  findAllPeminjaman(
    @Query() query: QueryPeminjamanDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.findAllPeminjaman(query, user);
  }

  @Get('peminjaman/:id')
  findOnePeminjaman(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.findOnePeminjaman(id, user);
  }

  @Post('peminjaman')
  createPeminjaman(
    @Body() dto: CreatePeminjamanDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.createPeminjaman(dto, user.id);
  }

  @Patch('peminjaman/:id/status')
  updatePeminjamanStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePeminjamanStatusDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.updatePeminjamanStatus(id, dto, user.id);
  }

  @Delete('peminjaman/:id')
  cancelPeminjaman(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.cancelPeminjaman(id, user);
  }
}
