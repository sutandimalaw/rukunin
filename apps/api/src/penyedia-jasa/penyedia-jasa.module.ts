import { Module } from '@nestjs/common';
import { PenyediaJasaController } from './penyedia-jasa.controller';
import { PenyediaJasaService } from './penyedia-jasa.service';

@Module({
  controllers: [PenyediaJasaController],
  providers: [PenyediaJasaService],
})
export class PenyediaJasaModule {}
