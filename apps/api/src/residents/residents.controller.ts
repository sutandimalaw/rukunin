import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResidentsService } from './residents.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { QueryResidentDto } from './dto/query-resident.dto';
import { UpsertResidentDto } from './dto/upsert-resident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Residents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('residents')
export class ResidentsController {
  constructor(private residentsService: ResidentsService) {}

  @Get()
  findAll(@Query() query: QueryResidentDto) {
    return this.residentsService.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.residentsService.getSummary();
  }

  @Get('my-profile')
  getMyProfile(@CurrentUser('email') email: string) {
    return this.residentsService.getMyProfile(email);
  }

  @Put('my-profile')
  upsertMyProfile(
    @CurrentUser() user: { id: string; email: string; role: string },
    @Body() dto: UpsertResidentDto,
  ) {
    return this.residentsService.upsertMyProfile(user, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateResidentDto, @CurrentUser('id') userId: string) {
    return this.residentsService.create(dto, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateResidentDto) {
    return this.residentsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residentsService.remove(id);
  }
}
