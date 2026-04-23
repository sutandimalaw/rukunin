import { PartialType } from '@nestjs/mapped-types';
import { CreateKegiatanWargaDto } from './create-kegiatan-warga.dto';

export class UpdateKegiatanWargaDto extends PartialType(CreateKegiatanWargaDto) {}
