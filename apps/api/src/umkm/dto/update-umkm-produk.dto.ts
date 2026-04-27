import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUmkmProdukDto } from './create-umkm-produk.dto';

export class UpdateUmkmProdukDto extends PartialType(CreateUmkmProdukDto) {
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
