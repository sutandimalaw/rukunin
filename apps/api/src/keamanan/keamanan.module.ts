import { Module } from '@nestjs/common';
import { KeamananController } from './keamanan.controller';
import { KeamananService } from './keamanan.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [KeamananController],
  providers: [KeamananService],
})
export class KeamananModule {}
