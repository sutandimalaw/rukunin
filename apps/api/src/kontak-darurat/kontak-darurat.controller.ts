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
import { KontakDaruratService } from './kontak-darurat.service';
import { CreateKontakDaruratDto } from './dto/create-kontak-darurat.dto';
import { UpdateKontakDaruratDto } from './dto/update-kontak-darurat.dto';
import { QueryKontakDaruratDto } from './dto/query-kontak-darurat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('kontak-darurat')
export class KontakDaruratController {
  constructor(private readonly service: KontakDaruratService) {}

  @Get()
  findAll(@Query() query: QueryKontakDaruratDto) {
    return this.service.findAll(query);
  }

  @Get('admin/all')
  findAllAdmin(@Query() query: QueryKontakDaruratDto) {
    return this.service.findAllAdmin(query);
  }

  @Post()
  create(
    @Body() dto: CreateKontakDaruratDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKontakDaruratDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
