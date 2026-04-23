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
import { KegiatanWargaService } from './kegiatan-warga.service';
import { CreateKegiatanWargaDto } from './dto/create-kegiatan-warga.dto';
import { UpdateKegiatanWargaDto } from './dto/update-kegiatan-warga.dto';
import { ScheduleKegiatanDto } from './dto/schedule-kegiatan.dto';
import { QueryKegiatanWargaDto } from './dto/query-kegiatan-warga.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('kegiatan-warga')
export class KegiatanWargaController {
  constructor(private readonly service: KegiatanWargaService) {}

  @Get()
  findAll(@Query() query: QueryKegiatanWargaDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.findOne(id, user.id);
  }

  @Post()
  create(
    @Body() dto: CreateKegiatanWargaDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKegiatanWargaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':id/vote')
  vote(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.vote(id, user.id);
  }

  @Delete(':id/vote')
  unvote(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.unvote(id, user.id);
  }

  @Post(':id/schedule')
  schedule(@Param('id') id: string, @Body() dto: ScheduleKegiatanDto) {
    return this.service.schedule(id, dto);
  }

  @Post(':id/rsvp')
  rsvp(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.rsvp(id, user.id);
  }

  @Delete(':id/rsvp')
  unrsvp(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.service.unrsvp(id, user.id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(id);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.service.complete(id);
  }
}
