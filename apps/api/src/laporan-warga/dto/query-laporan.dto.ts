import { IsOptional, IsNumberString, IsString, IsIn, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryLaporanDto {
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  kategori?: string;

  @IsOptional()
  @IsString()
  prioritas?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsIn(['TERBARU', 'TERLAMA', 'STATUS', 'PRIORITAS'])
  sort?: string = 'TERBARU';
}
