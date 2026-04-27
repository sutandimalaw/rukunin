import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export const LAYANAN_TYPES = [
  'SURAT_KETERANGAN',
  'LAPORAN_KERUSAKAN',
  'LAPORAN_KEAMANAN',
  'PENGADUAN_UMUM',
] as const;

export class CreateLayananWargaDto {
  @IsString()
  @IsIn(LAYANAN_TYPES as unknown as string[])
  type: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
