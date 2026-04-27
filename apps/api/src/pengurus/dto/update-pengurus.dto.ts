import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { POSISI_PENGURUS } from './create-pengurus.dto';

export class UpdatePengurusDto {
  @IsString()
  @IsIn(POSISI_PENGURUS as unknown as string[])
  @IsOptional()
  posisi?: string;

  @IsString()
  @IsOptional()
  customPosisi?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  urutan?: number;

  @IsUUID()
  @IsOptional()
  userId?: string | null;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  photoUrl?: string;

  @IsInt()
  @Min(1900)
  @IsOptional()
  periodeStart?: number;

  @IsInt()
  @Min(1900)
  @IsOptional()
  periodeEnd?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}
