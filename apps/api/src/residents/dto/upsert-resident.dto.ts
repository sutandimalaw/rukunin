import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpsertResidentDto {
  @ApiProperty({ example: '3201234567890001' })
  @IsString()
  @IsNotEmpty()
  @MinLength(11)
  kkNumber: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  blok?: string;

  @ApiPropertyOptional({ example: '01' })
  @IsOptional()
  @IsString()
  rt?: string;

  @ApiPropertyOptional({ example: '12' })
  @IsOptional()
  @IsString()
  houseNumber?: string;

  @ApiPropertyOptional({ example: '36/72' })
  @IsOptional()
  @IsString()
  houseType?: string;

  @ApiPropertyOptional({ enum: ['OWNER', 'RENT'] })
  @IsOptional()
  @IsString()
  ownershipStatus?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Sutandi Azhari' })
  fullName: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '3201234567890001' })
  @MinLength(11)
  idNumber?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'MEN' })
  gender: string;

  @ApiPropertyOptional({ example: '1990-01-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'MARRIED' })
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'Software Engineer' })
  occupation?: string;
}
