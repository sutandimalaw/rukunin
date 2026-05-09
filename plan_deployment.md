# Plan Deployment Rukunin

## Stack & Keputusan Final

| Komponen | Pilihan |
|---|---|
| VPS | IDCloudHost Basic Standard — 2 Core, 2GB RAM, **40GB NVMe** |
| OS | Ubuntu 24.04 LTS |
| Process Manager | PM2 (fork mode) |
| Reverse Proxy | Nginx |
| SSL | Certbot + Let's Encrypt |
| Database | PostgreSQL 16 (langsung di VPS, bukan Docker) |
| CI/CD | GitHub Actions → SSH → build di VPS → pm2 reload |
| Docker | ❌ Tidak dipakai |
| Coolify | ❌ Tidak dipakai |

**Arsitektur Domain:**
- `rukunin.my.id` → Nginx → Next.js port 3000
- `api.rukunin.my.id` → Nginx → NestJS port 3001

**Deploy Flow:**
```
Push to main
     ↓
GitHub Actions (ubuntu-latest, gratis)
     ↓ SSH via deploy key
VPS /var/www/rukunin
     ├── git pull origin main
     ├── npm ci
     ├── npm run build:api   (~20 detik)
     ├── npm run build:web   (~5-10 menit, swap aktif)
     ├── prisma migrate deploy
     └── pm2 reload          (graceful, zero downtime)
     ✅ ~12 menit total
```

---

## Files yang Dibuat di Repo

| File | Lokasi | Keterangan |
|---|---|---|
| `ecosystem.config.js` | root monorepo | PM2 config kedua apps |
| `.github/workflows/deploy.yml` | root | CI/CD workflow |

**File di VPS saja (tidak di-commit):**
- `/var/www/rukunin/apps/api/.env` — production env API
- `/var/www/rukunin/apps/web/.env.local` — production env Web

---

## Phase 1 — VPS Initial Setup

### 1.1 System

```bash
# SSH ke VPS sebagai root
ssh root@<VPS_IP>

# Update system
apt update && apt upgrade -y

# Buat non-root deploy user
adduser deploy
usermod -aG sudo deploy

# Copy SSH key ke deploy user
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy

# Disable root SSH login
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart sshd
```

### 1.2 Firewall

```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

### 1.3 Swap 2GB (WAJIB — untuk Next.js build di 2GB RAM)

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

---

## Phase 2 — Install Dependencies

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt-get install -y nodejs

# PM2
npm install -g pm2

# PostgreSQL 16
apt install -y postgresql postgresql-contrib

# Nginx
apt install -y nginx

# Certbot
apt install -y certbot python3-certbot-nginx

# Git
apt install -y git
```

---

## Phase 3 — Database Setup

```bash
sudo -u postgres psql
```

Di dalam psql:
```sql
CREATE USER rukunin_prod WITH PASSWORD '<GANTI_PASSWORD_KUAT>';
CREATE DATABASE rukunin_production OWNER rukunin_prod;
GRANT ALL PRIVILEGES ON DATABASE rukunin_production TO rukunin_prod;
\q
```

Test koneksi:
```bash
psql -U rukunin_prod -d rukunin_production -h localhost
```

---

## Phase 4 — Clone & Build Pertama Kali

```bash
# Buat direktori sebagai root, lalu chown ke deploy user
mkdir -p /var/www/rukunin
chown deploy:deploy /var/www/rukunin

# Switch ke deploy user
su - deploy

# Clone repo
git clone https://github.com/<USERNAME>/rukunin.git /var/www/rukunin
cd /var/www/rukunin
```

### 4.1 Buat Production Environment Files

**`/var/www/rukunin/apps/api/.env`:**
```env
DATABASE_URL="postgresql://rukunin_prod:<PASSWORD>@localhost:5432/rukunin_production"
JWT_SECRET=<generate: openssl rand -base64 64>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<generate: openssl rand -base64 64>
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=https://rukunin.my.id
NODE_ENV=production
```

**`/var/www/rukunin/apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://api.rukunin.my.id/api/v1
```

Generate JWT secrets:
```bash
openssl rand -base64 64
```

### 4.2 Install, Migrate & Build

```bash
cd /var/www/rukunin

npm ci
npx prisma generate --schema apps/api/prisma/schema.prisma
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
npm run build:api
npm run build:web
```

---

## Phase 5 — PM2 Setup

### File: `ecosystem.config.js` (root monorepo, di-commit)

```js
module.exports = {
  apps: [
    {
      name: 'rukunin-api',
      script: './apps/api/dist/main.js',
      cwd: '/var/www/rukunin',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'rukunin-web',
      script: 'node_modules/.bin/next',
      args: 'start --port 3000',
      cwd: '/var/www/rukunin/apps/web',
      instances: 1,
      exec_mode: 'fork',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
```

```bash
# Start kedua apps
pm2 start ecosystem.config.js --env production

# Simpan config
pm2 save

# Auto-start saat VPS reboot
pm2 startup
# Jalankan command yang muncul dari output pm2 startup
```

---

## Phase 6 — Nginx Config

### Frontend: `/etc/nginx/sites-available/rukunin`

```nginx
server {
    listen 80;
    server_name rukunin.my.id www.rukunin.my.id;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Backend API: `/etc/nginx/sites-available/rukunin-api`

```nginx
server {
    listen 80;
    server_name api.rukunin.my.id;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable sites
ln -s /etc/nginx/sites-available/rukunin /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/rukunin-api /etc/nginx/sites-enabled/

# Hapus default site
rm /etc/nginx/sites-enabled/default

# Test dan reload
nginx -t
systemctl reload nginx
```

---

## Phase 7 — DNS + SSL

### 7.1 DNS Records (di domain registrar)

| Type | Name | Value |
|---|---|---|
| A | `rukunin.my.id` | `<VPS_IP>` |
| A | `www.rukunin.my.id` | `<VPS_IP>` |
| A | `api.rukunin.my.id` | `<VPS_IP>` |

Tunggu propagasi ~5-30 menit. Cek: `nslookup rukunin.my.id`

### 7.2 Issue SSL

```bash
certbot --nginx -d rukunin.my.id -d www.rukunin.my.id
certbot --nginx -d api.rukunin.my.id

# Test auto-renewal
certbot renew --dry-run
```

---

## Phase 8 — CI/CD Setup

### 8.1 Generate SSH Deploy Key (di local machine)

```bash
ssh-keygen -t ed25519 -C "github-deploy-rukunin" -f ~/.ssh/rukunin_deploy -N ""
```

Tambah public key ke VPS:
```bash
# Isi file rukunin_deploy.pub, paste ke VPS:
echo "<isi file .pub>" >> /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
```

### 8.2 GitHub Secrets

Pergi ke: GitHub repo → Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value |
|---|---|
| `VPS_HOST` | IP address VPS IDCloudHost |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Seluruh isi file `~/.ssh/rukunin_deploy` (private key) |
| `VPS_PORT` | `22` |

### 8.3 Jika Repo Private — Setup Git Pull di VPS

```bash
# Di VPS, update remote URL dengan personal access token GitHub
git remote set-url origin https://<GITHUB_TOKEN>@github.com/<USERNAME>/rukunin.git
```

Token dibuat di: GitHub → Settings → Developer settings → Personal access tokens → scope: `repo`

### 8.4 File: `.github/workflows/deploy.yml` (di-commit)

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to IDCloudHost VPS
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          port: ${{ secrets.VPS_PORT }}
          command_timeout: 20m
          script: |
            cd /var/www/rukunin
            git pull origin main
            npm ci
            npm run build:api
            npm run build:web
            npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
            pm2 reload ecosystem.config.js --env production
            pm2 save
```

---

## Phase 9 — Post-Deploy

### 9.1 Buat Admin Pertama

Setelah deploy pertama, buat akun admin via SQL:

```bash
sudo -u postgres psql -d rukunin_production
```

```sql
-- Setelah register via form web, update role user:
UPDATE "User" SET role = 'ADMIN', status = 'ACTIVE' WHERE email = 'your@email.com';
```

### 9.2 Setup Database Backup Harian

```bash
# Buat direktori backup
mkdir -p /var/backups/rukunin

# Tambah cron job (sebagai deploy user)
crontab -e
```

Tambah baris:
```
0 2 * * * pg_dump -U rukunin_prod rukunin_production > /var/backups/rukunin/rukunin_$(date +\%Y\%m\%d).sql 2>/dev/null
# Hapus backup lebih dari 30 hari
0 3 * * * find /var/backups/rukunin -name "*.sql" -mtime +30 -delete
```

### 9.3 Setup UptimeRobot (Gratis)

1. Daftar di [uptimerobot.com](https://uptimerobot.com) (free tier: 50 monitors)
2. Tambah monitor: `https://rukunin.my.id` (HTTP, interval 5 menit)
3. Tambah monitor: `https://api.rukunin.my.id/api/v1` (HTTP, interval 5 menit)
4. Notifikasi via email jika down

---

## Verification Checklist

```bash
# Di VPS setelah setup selesai:
pm2 status                              # Kedua apps: online
pm2 logs --lines 20                     # Tidak ada error
systemctl status nginx                  # Active: running
systemctl status postgresql             # Active: running
certbot certificates                    # SSL valid, expiry tampil

# Cek dari browser:
# https://rukunin.my.id             → Login page tampil, HTTPS aktif (gembok hijau)
# https://www.rukunin.my.id         → Redirect ke rukunin.my.id
# https://api.rukunin.my.id/api/v1  → JSON response
# https://api.rukunin.my.id/api/docs → Swagger UI terbuka
```

**Test CI/CD:**
1. Push 1 commit kecil ke branch `main`
2. Buka tab **Actions** di GitHub repo → harus muncul job baru
3. Tunggu ~12 menit → status harus ✅ success (hijau)
4. Cek perubahan live di `https://rukunin.my.id`

---

## Multi-Site (Website Kedua Nanti)

Saat menambah website baru ke VPS yang sama:

1. Clone repo website baru ke `/var/www/website-baru/`
2. Buat Nginx config baru: `/etc/nginx/sites-available/website-baru`
3. Enable site + `nginx -t` + reload
4. Jalankan PM2 untuk website baru (dari repo tersendiri)
5. `certbot --nginx -d domain-baru.com`

Semua independen, tidak saling ganggu dengan Rukunin.

---

## Estimasi Resource Usage

| Komponen | RAM |
|---|---|
| NestJS API (rukunin-api) | ~250MB |
| Next.js Web (rukunin-web) | ~400MB |
| PostgreSQL | ~150MB |
| Nginx | ~20MB |
| OS + PM2 baseline | ~200MB |
| **Total normal** | **~1.02GB** |
| Saat `next build` (deploy) | +800MB spike → swap aktif |
| Website ringan kedua (nanti) | +150-250MB |

VPS 2GB RAM aman untuk operasional normal. Swap 2GB handle spike saat build.

---

## Biaya Bulanan

| Item | Biaya |
|---|---|
| IDCloudHost Basic Standard 40GB | ~Rp 90.000/bln (estimasi) |
| Domain `rukunin.my.id` | ~Rp 1.250/bln (Rp 15.000/thn) |
| SSL (Let's Encrypt) | Rp 0 |
| GitHub Actions | Rp 0 (2.000 menit/bln gratis) |
| UptimeRobot | Rp 0 (free tier) |
| **Total** | **~Rp 91.250/bulan** |
| Revenue dari RT 4 | Rp 150.000/bulan |
| **Sisa (profit pilot)** | **~Rp 58.750/bulan** |
