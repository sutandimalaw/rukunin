import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const FAMILY_RELATIONS = [
  'KEPALA_KELUARGA',
  'ISTRI',
  'SUAMI',
  'ANAK',
  'ORANG_TUA',
  'MERTUA',
  'MENANTU',
  'CUCU',
  'ART',
  'FAMILI_LAIN',
  'LAINNYA',
] as const;

export type FamilyRelation = (typeof FAMILY_RELATIONS)[number];

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

  @ApiProperty({ example: 'household-uuid' })
  @IsString()
  @IsNotEmpty()
  householdId: string;

  @ApiProperty({ example: 'ANAK', enum: FAMILY_RELATIONS })
  @IsString()
  @IsNotEmpty()
  familyRelation: string;
}
