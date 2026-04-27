import { IsString, IsOptional, IsIn, IsBoolean } from 'class-validator';

export class CreatePetugasDto {
  @IsString()
  fullName: string;

  @IsIn(['PAGI', 'SIANG', 'MALAM'])
  shift: string;

  @IsString()
  shiftTime: string;

  @IsOptional()
  @IsString()
  whatsapp?: string;

  @IsOptional()
  @IsBoolean()
  isOnDuty?: boolean;
}
