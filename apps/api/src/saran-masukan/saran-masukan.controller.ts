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
import { SaranMasukanService } from './saran-masukan.service';
import { CreateSaranMasukanDto } from './dto/create-saran-masukan.dto';
import { RespondSaranMasukanDto } from './dto/respond-saran-masukan.dto';
import { QuerySaranMasukanDto } from './dto/query-saran-masukan.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('saran-masukan')
export class SaranMasukanController {
  constructor(private readonly service: SaranMasukanService) {}

  @Get()
  findAll(@Query() query: QuerySaranMasukanDto) {
    return this.service.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.service.getSummary();
  }

  @Get('mine')
  findMine(
    @Query() query: QuerySaranMasukanDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.findMine(query, user.id);
  }

  @Post()
  create(
    @Body() dto: CreateSaranMasukanDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id/respond')
  respond(
    @Param('id') id: string,
    @Body() dto: RespondSaranMasukanDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.respond(id, dto, user.id);
  }
}
