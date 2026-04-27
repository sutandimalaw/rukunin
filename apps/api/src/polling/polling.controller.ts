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
import { PollingService } from './polling.service';
import { CreatePollingDto } from './dto/create-polling.dto';
import { QueryPollingDto } from './dto/query-polling.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('polling')
export class PollingController {
  constructor(private readonly service: PollingService) {}

  @Get()
  findAll(
    @Query() query: QueryPollingDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.findAll(query, user.id);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.findOne(id, user.id);
  }

  @Post()
  create(
    @Body() dto: CreatePollingDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.create(dto, user.id);
  }

  @Post(':id/vote/:optionId')
  vote(
    @Param('id') pollingId: string,
    @Param('optionId') optionId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.vote(pollingId, optionId, user.id);
  }

  @Post(':id/close')
  close(
    @Param('id') id: string,
    @Body('status') status: 'SELESAI' | 'DIBATALKAN',
    @CurrentUser() user: { id: string },
  ) {
    return this.service.closePolling(id, status, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
