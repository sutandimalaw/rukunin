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
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Dues')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dues')
export class DuesController {
  constructor(private duesService: DuesService) {}

  @Get()
  findAll(@QueryParam() query: QueryDuesDto) {
    return this.duesService.findAll(query);
  }

  @Get('summary')
  getSummary(@QueryParam('period') period: string) {
    return this.duesService.getSummary(period);
  }

  @Get('household/:id')
  getByHousehold(@Param('id') id: string) {
    return this.duesService.getByHousehold(id);
  }

  @Get('my')
  getMyDues(@CurrentUser() user: { email: string }) {
    return this.duesService.getMyDues(user.email);
  }

  @Get('delinquent')
  getDelinquent(
    @QueryParam('minMonths', new DefaultValuePipe(3), ParseIntPipe)
    minMonths: number,
    @QueryParam('lookback', new DefaultValuePipe(6), ParseIntPipe)
    lookback: number,
  ) {
    return this.duesService.getDelinquent(minMonths, lookback);
  }

  @Post('generate')
  generate(@Body() dto: GenerateDuesDto, @CurrentUser('id') userId: string) {
    return this.duesService.generate(dto, userId);
  }

  @Patch('batch-pay')
  batchPay(@Body() dto: BatchPayDuesDto, @CurrentUser('id') userId: string) {
    return this.duesService.batchPay(dto, userId);
  }

  @Patch(':id/pay')
  pay(
    @Param('id') id: string,
    @Body() dto: PayDuesDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.duesService.pay(id, dto, userId);
  }

  @Patch(':id/unpay')
  unpay(@Param('id') id: string) {
    return this.duesService.unpay(id);
  }

  @Patch('request-pay')
  requestPay(@Body() dto: RequestPayDuesDto) {
    return this.duesService.requestPay(dto);
  }

  @Patch(':id/reject')
  rejectPay(@Param('id') id: string) {
    return this.duesService.rejectPay(id);
  }
}
