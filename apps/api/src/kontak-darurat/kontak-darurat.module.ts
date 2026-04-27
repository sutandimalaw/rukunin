import { Module } from '@nestjs/common';
import { KontakDaruratController } from './kontak-darurat.controller';
import { KontakDaruratService } from './kontak-darurat.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KontakDaruratController],
  providers: [KontakDaruratService],
})
export class KontakDaruratModule {}
