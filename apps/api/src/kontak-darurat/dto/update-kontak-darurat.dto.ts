import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateKontakDaruratDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['RUMAH_SAKIT', 'POLISI', 'PEMADAM', 'PLN', 'PDAM', 'AMBULANS', 'LAINNYA'])
  category?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
