import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateSaranMasukanDto {
  @IsIn(['SARAN', 'KRITIK', 'MASUKAN', 'PUJIAN'])
  category: string;

  @IsString()
  @MinLength(3)
  subject: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}
