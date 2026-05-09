import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query as QueryParam,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DuesService } from './dues.service';
import { GenerateDuesDto } from './dto/generate-dues.dto';
import { QueryDuesDto } from './dto/query-dues.dto';
import { PayDuesDto } from './dto/pay-dues.dto';
import { BatchPayDuesDto } from './dto/batch-pay-dues.dto';
import { RequestPayDuesDto } from './dto/request-pay-dues.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Dues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dues')
export class DuesController {
  constructor(private duesService: DuesService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN')
  findAll(@QueryParam() query: QueryDuesDto) {
    return this.duesService.findAll(query);
  }

  @Get('summary')
  @Roles('SUPER_ADMIN', 'ADMIN')
  getSummary(@QueryParam('period') period: string) {
    return this.duesService.getSummary(period);
  }

  @Get('household/:id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  getByHousehold(@Param('id') id: string) {
    return this.duesService.getByHousehold(id);
  }

  @Get('my')
  @Roles('SUPER_ADMIN', 'ADMIN', 'WARGA')
  getMyDues(@CurrentUser() user: { email: string }) {
    return this.duesService.getMyDues(user.email);
  }

  @Get('delinquent')
  @Roles('SUPER_ADMIN', 'ADMIN')
  getDelinquent(
    @QueryParam('minMonths', new DefaultValuePipe(3), ParseIntPipe)
    minMonths: number,
    @QueryParam('lookback', new DefaultValuePipe(6), ParseIntPipe)
    lookback: number,
  ) {
    return this.duesService.getDelinquent(minMonths, lookback);
  }

  @Post('generate')
  @Roles('SUPER_ADMIN')
  generate(@Body() dto: GenerateDuesDto, @CurrentUser('id') userId: string) {
    return this.duesService.generate(dto, userId);
  }

  @Patch('batch-pay')
  @Roles('SUPER_ADMIN')
  batchPay(@Body() dto: BatchPayDuesDto, @CurrentUser('id') userId: string) {
    return this.duesService.batchPay(dto, userId);
  }

  @Patch(':id/pay')
  @Roles('SUPER_ADMIN')
  pay(
    @Param('id') id: string,
    @Body() dto: PayDuesDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.duesService.pay(id, dto, userId);
  }

  @Patch(':id/unpay')
  @Roles('SUPER_ADMIN')
  unpay(@Param('id') id: string) {
    return this.duesService.unpay(id);
  }

  @Patch('request-pay')
  @Roles('SUPER_ADMIN', 'ADMIN', 'WARGA')
  requestPay(@Body() dto: RequestPayDuesDto) {
    return this.duesService.requestPay(dto);
  }

  @Patch(':id/reject')
  @Roles('SUPER_ADMIN')
  rejectPay(@Param('id') id: string) {
    return this.duesService.rejectPay(id);
  }
}
