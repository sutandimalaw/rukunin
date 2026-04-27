import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateInsidenStatusDto {
  @IsIn(['DITINDAK', 'SELESAI', 'DITUTUP'])
  status: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
