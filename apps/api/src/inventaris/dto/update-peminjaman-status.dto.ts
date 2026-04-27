import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdatePeminjamanStatusDto {
  @IsIn(['DISETUJUI', 'DIPINJAM', 'DIKEMBALIKAN', 'DITOLAK'])
  status: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
