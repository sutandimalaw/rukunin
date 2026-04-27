import { IsString, IsOptional } from 'class-validator';

export class CreateBukuTamuDto {
  @IsString()
  guestName: string;

  @IsString()
  purpose: string;

  @IsOptional()
  @IsString()
  destinationBlock?: string;

  @IsOptional()
  @IsString()
  vehicleType?: string;

  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
