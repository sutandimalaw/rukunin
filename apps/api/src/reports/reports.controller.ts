import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('financial')
  getFinancialReport(@Query() query: ReportQueryDto) {
    return this.reportsService.getFinancialReport(query);
  }

  @Get('residents')
  getResidentsReport() {
    return this.reportsService.getResidentsReport();
  }
}
