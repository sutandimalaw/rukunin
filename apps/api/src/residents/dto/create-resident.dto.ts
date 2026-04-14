import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateResidentDto {
  @ApiProperty({ example: 'Sutandi Azhari' })
  @IsString()
  @MinLength(5)
  fullName: string;

  @ApiPropertyOptional({ example: '3201234567890001' })
  @IsOptional()
  @IsString()
  @MinLength(11)
  idNumber?: string;

  @ApiProperty({ example: 'MEN' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiPropertyOptional({ example: '1990-01-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'MARRIED' })
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '3201234567890001' })
  @IsOptional()
  @IsString()
  kk?: string;

  @ApiPropertyOptional({ example: 'SA3' })
  @IsOptional()
  @IsString()
  blok?: string;

  @ApiPropertyOptional({ example: '04' })
  @IsOptional()
  @IsString()
  rt?: string;

  @ApiPropertyOptional({ example: '01' })
  @IsOptional()
  @IsString()
  houseNumber?: string;

  @ApiPropertyOptional({ example: 'SB-3' })
  @IsOptional()
  @IsString()
  houseType?: string;

  @ApiPropertyOptional({ example: 'OWNER' })
  @IsOptional()
  @IsString()
  ownershipStatus?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  startDateOfOccupancy?: string;
}
