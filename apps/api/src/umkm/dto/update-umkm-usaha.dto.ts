import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUmkmUsahaDto } from './create-umkm-usaha.dto';

export class UpdateUmkmUsahaDto extends PartialType(CreateUmkmUsahaDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
