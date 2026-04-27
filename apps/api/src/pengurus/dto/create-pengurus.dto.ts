import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export const POSISI_PENGURUS = [
  'KETUA',
  'WAKIL_KETUA',
  'SEKRETARIS',
  'BENDAHARA',
  'SEKSI_KEAMANAN',
  'SEKSI_SOSIAL',
  'SEKSI_PEMUDA',
  'SEKSI_KEBERSIHAN',
  'SEKSI_HUMAS',
  'ANGGOTA',
  'LAINNYA',
] as const;

export class CreatePengurusDto {
  @IsString()
  @IsIn(POSISI_PENGURUS as unknown as string[])
  posisi: string;

  @IsString()
  @IsOptional()
  customPosisi?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  urutan?: number;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsInt()
  @Min(1900)
  periodeStart: number;

  @IsInt()
  @Min(1900)
  periodeEnd: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
