import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfilProfesiService } from './profil-profesi.service';
import { UpsertProfilProfesiDto } from './dto/upsert-profil-profesi.dto';
import { QueryProfilProfesiDto } from './dto/query-profil-profesi.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('profil-profesi')
export class ProfilProfesiController {
  constructor(private readonly service: ProfilProfesiService) {}

  @Get()
  findAll(
    @Query() query: QueryProfilProfesiDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    if (user.role === 'ADMIN') {
      return this.service.findAllAdmin(query);
    }
    return this.service.findAll(query);
  }

  @Get('me')
  findMine(@CurrentUser() user: { id: string }) {
    return this.service.findMine(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  upsert(
    @Body() dto: UpsertProfilProfesiDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.upsert(user.id, dto);
  }

  @Delete()
  remove(@CurrentUser() user: { id: string }) {
    return this.service.remove(user.id);
  }
}
