import { Module } from '@nestjs/common';
import { LayananWargaController } from './layanan-warga.controller';
import { LayananWargaService } from './layanan-warga.service';

@Module({
  controllers: [LayananWargaController],
  providers: [LayananWargaService],
})
export class LayananWargaModule {}
