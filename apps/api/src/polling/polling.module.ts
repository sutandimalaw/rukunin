import { Module } from '@nestjs/common';
import { PollingController } from './polling.controller';
import { PollingService } from './polling.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PollingController],
  providers: [PollingService],
})
export class PollingModule {}
