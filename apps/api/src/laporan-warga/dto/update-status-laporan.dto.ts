import { IsIn } from 'class-validator';

export class UpdateStatusLaporanDto {
  @IsIn(['MENUNGGU', 'DIPROSES', 'SELESAI'])
  status: string;
}
