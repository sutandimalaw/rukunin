import {
  IsString,
  IsOptional,
  IsEmail,
  IsDateString,
  MinLength,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateHouseholdDto } from './create-household.dto';

export class HeadResidentDto {
  @ApiProperty({ example: 'Sutandi Azhari' })
  @IsString()
  @MinLength(5)
  fullName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(11)
  idNumber?: string;

  @ApiProperty({ example: 'MEN' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateWithHeadDto {
  @ApiProperty({ type: CreateHouseholdDto })
  @ValidateNested()
  @Type(() => CreateHouseholdDto)
  household: CreateHouseholdDto;

  @ApiProperty({ type: HeadResidentDto })
  @ValidateNested()
  @Type(() => HeadResidentDto)
  head: HeadResidentDto;
}
