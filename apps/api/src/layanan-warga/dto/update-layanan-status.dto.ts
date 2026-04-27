import { IsIn, IsOptional, IsString } from 'class-validator';

export const LAYANAN_STATUSES = ['PROSES', 'SELESAI', 'DITOLAK'] as const;

export class UpdateLayananStatusDto {
  @IsString()
  @IsIn(LAYANAN_STATUSES as unknown as string[])
  status: string;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
