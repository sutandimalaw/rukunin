import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LaporanWargaService } from './laporan-warga.service';
import { CreateLaporanDto } from './dto/create-laporan.dto';
import { QueryLaporanDto } from './dto/query-laporan.dto';
import { UpdateStatusLaporanDto } from './dto/update-status-laporan.dto';
import { CreateKomentarDto } from './dto/create-komentar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('laporan-warga')
export class LaporanWargaController {
  constructor(private readonly service: LaporanWargaService) {}

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get()
  findAll(@Query() query: QueryLaporanDto) {
    return this.service.findAll(query);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }

  @Get('mine')
  findMine(
    @Query() query: QueryLaporanDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.findMine(query, user.id);
  }

  @Post()
  create(
    @Body() dto: CreateLaporanDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.create(dto, user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.findOne(id, user.id, user.role);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusLaporanDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.updateStatus(id, dto, user.id);
  }

  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @Post(':id/komentar')
  addKomentar(
    @Param('id') id: string,
    @Body() dto: CreateKomentarDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.addKomentar(id, dto, user.id);
  }
}
