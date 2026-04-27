import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const UMKM_CATEGORIES = [
  'MAKANAN',
  'MINUMAN',
  'JASA',
  'KERAJINAN',
  'FASHION',
  'ELEKTRONIK',
  'LAINNYA',
] as const;

export class CreateUmkmUsahaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn(UMKM_CATEGORIES as unknown as string[])
  category: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  whatsapp: string;
}
