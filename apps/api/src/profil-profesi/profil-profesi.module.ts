import { Module } from '@nestjs/common';
import { ProfilProfesiController } from './profil-profesi.controller';
import { ProfilProfesiService } from './profil-profesi.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProfilProfesiController],
  providers: [ProfilProfesiService],
})
export class ProfilProfesiModule {}
