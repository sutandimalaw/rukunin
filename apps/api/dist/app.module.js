"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const residents_module_1 = require("./residents/residents.module");
const finance_module_1 = require("./finance/finance.module");
const profiles_module_1 = require("./profiles/profiles.module");
const announcements_module_1 = require("./announcements/announcements.module");
const reports_module_1 = require("./reports/reports.module");
const households_module_1 = require("./households/households.module");
const dues_module_1 = require("./dues/dues.module");
const kegiatan_warga_module_1 = require("./kegiatan-warga/kegiatan-warga.module");
const layanan_warga_module_1 = require("./layanan-warga/layanan-warga.module");
const umkm_module_1 = require("./umkm/umkm.module");
const penyedia_jasa_module_1 = require("./penyedia-jasa/penyedia-jasa.module");
const pengurus_module_1 = require("./pengurus/pengurus.module");
const inventaris_module_1 = require("./inventaris/inventaris.module");
const keamanan_module_1 = require("./keamanan/keamanan.module");
const polling_module_1 = require("./polling/polling.module");
const kontak_darurat_module_1 = require("./kontak-darurat/kontak-darurat.module");
const saran_masukan_module_1 = require("./saran-masukan/saran-masukan.module");
const profil_profesi_module_1 = require("./profil-profesi/profil-profesi.module");
const laporan_warga_module_1 = require("./laporan-warga/laporan-warga.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            residents_module_1.ResidentsModule,
            finance_module_1.FinanceModule,
            profiles_module_1.ProfilesModule,
            announcements_module_1.AnnouncementsModule,
            reports_module_1.ReportsModule,
            households_module_1.HouseholdsModule,
            dues_module_1.DuesModule,
            kegiatan_warga_module_1.KegiatanWargaModule,
            layanan_warga_module_1.LayananWargaModule,
            umkm_module_1.UmkmModule,
            penyedia_jasa_module_1.PenyediaJasaModule,
            pengurus_module_1.PengurusModule,
            inventaris_module_1.InventarisModule,
            keamanan_module_1.KeamananModule,
            polling_module_1.PollingModule,
            kontak_darurat_module_1.KontakDaruratModule,
            saran_masukan_module_1.SaranMasukanModule,
            profil_profesi_module_1.ProfilProfesiModule,
            laporan_warga_module_1.LaporanWargaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map