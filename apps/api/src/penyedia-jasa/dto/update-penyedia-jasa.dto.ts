import { IsIn, IsOptional, IsString } from 'class-validator';
import { PENYEDIA_JASA_CATEGORIES } from './create-penyedia-jasa.dto';

export class UpdatePenyediaJasaDto {
  @IsString()
  @IsOptional()
  personName?: string;

  @IsString()
  @IsIn(PENYEDIA_JASA_CATEGORIES as unknown as string[])
  @IsOptional()
  category?: string;

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
