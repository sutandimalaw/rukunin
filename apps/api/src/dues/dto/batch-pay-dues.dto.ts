import { IsArray, IsString, ArrayMinSize, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BatchPayDuesDto {
  @ApiProperty({ example: ['id1', 'id2'] })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  ids: string[];

  @ApiPropertyOptional({ example: 'Lunasi tunggakan 3 bulan' })
  @IsOptional()
  @IsString()
  notes?: string;
}
