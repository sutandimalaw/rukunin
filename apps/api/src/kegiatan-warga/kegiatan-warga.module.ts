import { Module } from '@nestjs/common';
import { KegiatanWargaController } from './kegiatan-warga.controller';
import { KegiatanWargaService } from './kegiatan-warga.service';

@Module({
  controllers: [KegiatanWargaController],
  providers: [KegiatanWargaService],
})
export class KegiatanWargaModule {}
