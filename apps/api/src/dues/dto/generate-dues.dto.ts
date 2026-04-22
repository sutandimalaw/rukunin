import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateDuesDto {
  @ApiProperty({ example: '2026-04', description: 'Period format YYYY-MM' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}$/, { message: 'Period harus format YYYY-MM' })
  period: string;

  @ApiProperty({ example: 100000, description: 'Nominal iuran per KK' })
  @IsNumber()
  @IsPositive()
  amount: number;
}
