import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PayDuesDto {
  @ApiPropertyOptional({ example: 'Bayar tunai' })
  @IsOptional()
  @IsString()
  notes?: string;
}
