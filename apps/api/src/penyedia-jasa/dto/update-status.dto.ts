import { IsIn, IsOptional, IsString } from 'class-validator';

export const PENYEDIA_JASA_STATUSES = ['PENDING', 'ACTIVE', 'REJECTED'] as const;

export class UpdatePenyediaJasaStatusDto {
  @IsString()
  @IsIn(PENYEDIA_JASA_STATUSES as unknown as string[])
  status: string;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
