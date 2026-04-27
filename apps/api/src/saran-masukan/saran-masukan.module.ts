import { Module } from '@nestjs/common';
import { SaranMasukanController } from './saran-masukan.controller';
import { SaranMasukanService } from './saran-masukan.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SaranMasukanController],
  providers: [SaranMasukanService],
})
export class SaranMasukanModule {}
