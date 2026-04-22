import { IsOptional, IsString, IsInt, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDuesDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 50;

  @ApiPropertyOptional({
    example: '2026-04',
    description: 'Filter by period YYYY-MM',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Period harus format YYYY-MM' })
  period?: string;

  @ApiPropertyOptional({
    enum: ['UNPAID', 'PAID'],
    description: 'Filter by status',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
