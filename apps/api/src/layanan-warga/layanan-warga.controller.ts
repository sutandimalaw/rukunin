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
import { LayananWargaService } from './layanan-warga.service';
import { CreateLayananWargaDto } from './dto/create-layanan-warga.dto';
import { UpdateLayananStatusDto } from './dto/update-layanan-status.dto';
import { QueryLayananWargaDto } from './dto/query-layanan-warga.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('layanan-warga')
export class LayananWargaController {
  constructor(private readonly service: LayananWargaService) {}

  @Get()
  findAll(
    @Query() query: QueryLayananWargaDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.findAll(query, user);
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
    @Body() dto: CreateLayananWargaDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLayananStatusDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.updateStatus(id, dto, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.service.remove(id, user);
  }
}
