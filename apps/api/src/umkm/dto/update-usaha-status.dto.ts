import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateUsahaStatusDto {
  @IsString()
  @IsIn(['ACTIVE', 'REJECTED'])
  status: string;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
