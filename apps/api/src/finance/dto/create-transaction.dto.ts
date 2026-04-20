import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsIn,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 'IN', enum: ['IN', 'OUT'] })
  @IsString()
  @IsIn(['IN', 'OUT'])
  type: string;

  @ApiProperty({ example: 'iuran_kas' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'Iuran bulan April 2026' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: '2026-04-12' })
  @IsOptional()
  @IsDateString()
  date?: string;
}
