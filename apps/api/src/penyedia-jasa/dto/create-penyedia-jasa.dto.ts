import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export const PENYEDIA_JASA_CATEGORIES = [
  'TUKANG',
  'ART',
  'BABY_SITTER',
  'MONTIR',
  'LAUNDRY',
  'KEBUN',
  'LAINNYA',
] as const;

export class CreatePenyediaJasaDto {
  @IsString()
  @IsNotEmpty()
  personName: string;

  @IsString()
  @IsIn(PENYEDIA_JASA_CATEGORIES as unknown as string[])
  category: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  area?: string;
}
