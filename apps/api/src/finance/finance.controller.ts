import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FinanceService } from './finance.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get()
  findAll(@Query() query: QueryTransactionDto) {
    return this.financeService.findAll(query);
  }

  @Get('summary')
  getSummary() {
    return this.financeService.getSummary();
  }

  @Post()
  create(
    @Body() dto: CreateTransactionDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.financeService.create(dto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financeService.remove(id);
  }
}
