import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHouseholdDto {
  @ApiProperty({ example: '3201234567890001' })
  @IsString()
  @MinLength(11)
  kkNumber: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  blok?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  houseNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  houseType?: string;

  @ApiPropertyOptional({ enum: ['OWNER', 'RENT'] })
  @IsOptional()
  @IsString()
  ownershipStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDateOfOccupancy?: string;
}
