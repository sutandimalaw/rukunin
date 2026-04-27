import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class UpdatePetugasDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsIn(['PAGI', 'SIANG', 'MALAM'])
  shift?: string;

  @IsOptional()
  @IsString()
  shiftTime?: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsBoolean()
  isOnDuty?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
