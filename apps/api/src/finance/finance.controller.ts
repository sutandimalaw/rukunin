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
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Finance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  findAll(@Query() query: QueryTransactionDto) {
    return this.financeService.findAll(query);
  }

  @Get('summary')
  @Roles('SUPER_ADMIN', 'ADMIN')
  getSummary() {
    return this.financeService.getSummary();
  }

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() dto: CreateTransactionDto, @CurrentUser('id') userId: string) {
    return this.financeService.create(dto, userId);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.financeService.remove(id);
  }
}
