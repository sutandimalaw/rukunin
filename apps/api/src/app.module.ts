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
import { LayananWargaModule } from './layanan-warga/layanan-warga.module';
import { UmkmModule } from './umkm/umkm.module';
import { PenyediaJasaModule } from './penyedia-jasa/penyedia-jasa.module';
import { PengurusModule } from './pengurus/pengurus.module';
import { InventarisModule } from './inventaris/inventaris.module';
import { KeamananModule } from './keamanan/keamanan.module';
import { PollingModule } from './polling/polling.module';
import { KontakDaruratModule } from './kontak-darurat/kontak-darurat.module';
import { SaranMasukanModule } from './saran-masukan/saran-masukan.module';
import { ProfilProfesiModule } from './profil-profesi/profil-profesi.module';
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
    LayananWargaModule,
    UmkmModule,
    PenyediaJasaModule,
    PengurusModule,
    InventarisModule,
    KeamananModule,
    PollingModule,
    KontakDaruratModule,
    SaranMasukanModule,
    ProfilProfesiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
