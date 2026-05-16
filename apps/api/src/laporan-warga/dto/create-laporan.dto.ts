import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsIn,
  IsArray,
} from 'class-validator';

export class CreateLaporanDto {
  @IsString()
  @IsNotEmpty()
  judul: string;

  @IsIn(['INFRASTRUKTUR', 'KEBERSIHAN', 'KEAMANAN', 'SOSIAL', 'LAINNYA'])
  kategori: string;

  @IsOptional()
  @IsIn(['PENTING', 'NORMAL', 'RENDAH'])
  prioritas?: string;

  @IsString()
  @MinLength(20, { message: 'Deskripsi minimal 20 karakter' })
  deskripsi: string;

  @IsOptional()
  @IsString()
  lokasi?: string;

  @IsOptional()
  @IsString()
  namaPerlapor?: string;

  @IsOptional()
  @IsString()
  rtPerlapor?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fotoUrls?: string[];
}
