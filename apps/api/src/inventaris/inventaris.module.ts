import { Module } from '@nestjs/common';
import { InventarisController } from './inventaris.controller';
import { InventarisService } from './inventaris.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InventarisController],
  providers: [InventarisService],
})
export class InventarisModule {}
