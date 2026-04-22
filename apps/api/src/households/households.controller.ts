import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HouseholdsService } from './households.service';
import { CreateHouseholdDto } from './dto/create-household.dto';
import { UpdateHouseholdDto } from './dto/update-household.dto';
import { QueryHouseholdDto } from './dto/query-household.dto';
import { CreateWithHeadDto } from './dto/create-with-head.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Households')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('households')
export class HouseholdsController {
  constructor(private householdsService: HouseholdsService) {}

  @Get()
  findAll(@Query() query: QueryHouseholdDto) {
    return this.householdsService.findAll(query);
  }

  @Get('by-kk/:kkNumber')
  findByKkNumber(@Param('kkNumber') kkNumber: string) {
    return this.householdsService.findByKkNumber(kkNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.householdsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateHouseholdDto, @CurrentUser('id') userId: string) {
    return this.householdsService.create(dto, userId);
  }

  @Post('with-head')
  createWithHead(
    @Body() dto: CreateWithHeadDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.householdsService.createWithHead(dto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHouseholdDto) {
    return this.householdsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.householdsService.remove(id);
  }
}
