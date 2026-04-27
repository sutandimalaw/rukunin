import { Module } from '@nestjs/common';
import { PengurusController } from './pengurus.controller';
import { PengurusService } from './pengurus.service';

@Module({
  controllers: [PengurusController],
  providers: [PengurusService],
})
export class PengurusModule {}
