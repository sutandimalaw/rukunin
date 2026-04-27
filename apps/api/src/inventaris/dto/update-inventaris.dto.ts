import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class UpdateInventarisDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn([
    'ELEKTRONIK',
    'FURNITURE',
    'ALAT_OLAHRAGA',
    'TENDA_DEKORASI',
    'DAPUR',
    'KEBERSIHAN',
    'LAINNYA',
  ])
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsIn(['BAIK', 'RUSAK_RINGAN', 'RUSAK_BERAT'])
  condition?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
