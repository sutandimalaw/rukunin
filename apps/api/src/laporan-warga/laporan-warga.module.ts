import { Module } from '@nestjs/common';
import { LaporanWargaController } from './laporan-warga.controller';
import { LaporanWargaService } from './laporan-warga.service';

@Module({
  controllers: [LaporanWargaController],
  providers: [LaporanWargaService],
})
export class LaporanWargaModule {}
