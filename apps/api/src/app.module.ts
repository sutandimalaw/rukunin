import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ResidentsModule } from './residents/residents.module';
import { FinanceModule } from './finance/finance.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { ReportsModule } from './reports/reports.module';
import { HouseholdsModule } from './households/households.module';
import { DuesModule } from './dues/dues.module';
import { KegiatanWargaModule } from './kegiatan-warga/kegiatan-warga.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ResidentsModule,
    FinanceModule,
    ProfilesModule,
    AnnouncementsModule,
    ReportsModule,
    HouseholdsModule,
    DuesModule,
    KegiatanWargaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
