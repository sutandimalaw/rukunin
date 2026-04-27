import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class CreateLaporanInsidenDto {
  @IsIn([
    'PENCURIAN',
    'VANDALISME',
    'GANGGUAN_KETERTIBAN',
    'ORANG_MENCURIGAKAN',
    'KECELAKAAN',
    'KEBAKARAN',
    'LAINNYA',
  ])
  category: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsIn(['RENDAH', 'SEDANG', 'TINGGI', 'DARURAT'])
  severity?: string;

  @IsDateString()
  incidentDate: string;
}
