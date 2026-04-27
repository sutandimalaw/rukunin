import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const PROFIL_KATEGORI = [
  'TEKNOLOGI',
  'KESEHATAN',
  'PENDIDIKAN',
  'HUKUM',
  'KEUANGAN',
  'TEKNIK',
  'SENI_KREATIF',
  'KULINER',
  'PERDAGANGAN',
  'LAINNYA',
] as const;

export class UpsertProfilProfesiDto {
  @IsString()
  @IsIn(PROFIL_KATEGORI as unknown as string[])
  category: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsNotEmpty()
  skills: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
