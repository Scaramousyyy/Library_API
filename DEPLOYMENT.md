# 🚀 DEPLOYMENT.md : Panduan Deployment Library Management System API
Dokumen ini berisi panduan lengkap untuk _deployment_ dan maintenance aplikasi **Library Management System API** di lingkungan produksi (AWS EC2).

---

## I. Informasi Proyek
| Detail | Deskripsi |
| --- | --- |
| **🔗Repository Github** | https://github.com/Scaramousyyy/Library_API |
| **📱Nama Aplikasi** | library-api |
| **👨🏻‍💻Process Manager** | PM2 |
| **🔀Reverse Proxy** | Nginx |


## II. Detail Lingkungan Produksi (AWS EC2)
Detail ini harus diisi setelah _instance_ diluncurkan.

| Detail | Value |
| --- | --- |
| **Production URL (IP)** |	`http://3.225.47.3` |
| **Base URL API** |	`http://3.225.47.3/api` |
| **Health Check URL** |	`http://3.225.47.3/api/health` |
| **AWS Region** |	`us-east-1` |
| **Instance ID** |	`i-0df680349f995bb9a` |
| **Instance Type** |	`t2.micro` |
| **Operating System** |	Ubuntu 22.04 LTS |
| **Database** |	SQLite (File: `./dev.db` di server) |


## III. Konfigurasi Environment Variables
Variabel lingkungan yang wajib ada di file `.env` di server.

| Variabel | Deskripsi |
| --- | --- |
| `NODE_ENV`	| Harus disetel ke `production` |
| `PORT`	| Port aplikasi (Default: `3000`) |
| `DATABASE_URL` |	Koneksi database (e.g., `file:./dev.db`) |
| `CORS_ORIGIN` |	Domain yang diizinkan CORS (e.g., `*` atau URL Frontend) |
| `JWT_SECRET`	| Secret Key rahasia untuk Access Token |
| `JWT_EXPIRES_IN`	| Masa berlaku Access Token (e.g., `15m`) |
| `JWT_REFRESH_SECRET`	| Secret Key rahasia untuk Refresh Token |
| `JWT_REFRESH_EXPIRES_IN` |	Masa berlaku Refresh Token (e.g., `7d`) |

## IV. Langkah Deployment (Step-by-Step Guide)
_Asumsi Anda sudah memiliki instance EC2 Ubuntu yang berjalan dan telah terhubung via SSH._

**1. Persiapan Server**
```Bash
# Update System
sudo apt update && sudo apt upgrade -y

# Instal NVM & Node.js v18
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18 && nvm use 18

# Instal Global Dependencies
npm install -g pm2
sudo apt install nginx -y
```
**2. Deployment Kode**
```Bash
# Clone Repository
git clone https://github.com/Scaramousyyy/Library_API library-api
cd library-api

# Instal Dependencies Proyek
npm install
```

**3. Konfigurasi Environment**
Buat dan isi file `.env` (Pastikan `NODE_ENV=production` dan secret sudah diganti).
```Bash
cp .env.example .env
nano .env 
# (Isi values dan Save: Ctrl+X, Y, Enter)
```

**4. Setup Database (Migration & Seeding)**
```Bash
# Wajib: Generate Prisma Client untuk arsitektur Linux
npx prisma generate

# Migrasi Database (Membuat dev.db dan skema)
npx prisma migrate deploy

# Isi Data Awal (Admin, Categories, dll.)
npx prisma db seed
```
 
**5. Application Start (PM2)**
```Bash
# Jalankan aplikasi di background (Port 3000)
pm2 start npm --name "library-api" -- start

# Simpan konfigurasi PM2
pm2 save

# Setup agar PM2 restart otomatis setelah reboot server
pm2 startup
# (SALIN & JALANKAN perintah sudo yang muncul)
```

**6. Konfigurasi Nginx Reverse Proxy**
```Bash
# Buat file konfigurasi
sudo nano /etc/nginx/sites-available/library-api
# (Paste konfigurasi di bawah dan Save)

# Aktifkan konfigurasi
sudo ln -s /etc/nginx/sites-available/library-api /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Tes dan Restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

Konten File Nginx (`/etc/nginx/sites-available/library-api`)
```Nginx

server {
    listen 80;
    server_name _; 
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## V. Langkah Verifikasi (Testing Deployment)
Gunakan Postman atau _browser_ dari komputer lokal Anda untuk memverifikasi fungsionalitas.

| Test | URL | Method | Hasil yang Diharapkan |
| --- | --- | --- | --- |
| **Health Check**	| http://3.225.47.3/api/health |	GET	| Status **200 OK** (Nginx dan App berjalan) |
| **Root URL** |	http://3.225.47.3/	| GET	| Status **200 OK** (Response dasar aplikasi) |
| **Login** |	http://3.225.47.3/api/auth/login	| POST	| Status **200 OK** dan menerima token (Database dan App Logic berjalan) |

## VI. Monitoring, Troubleshooting, dan Maintenance

**1. Monitoring (Cara Cek Status)**
| Command |	Deskripsi |
| --- | --- |
| `pm2 status`	| Melihat status semua proses (wajib `online`). |
| `pm2 logs library-api` | Melihat _log_ gabungan (stdout & stderr) secara _real-time_. |
| `pm2 monit`	| Membuka dashboard monitoring _real-time_ (CPU/Memory). |
| `sudo systemctl status nginx` |	Memeriksa apakah Nginx sedang berjalan. |

**2. Troubleshooting (Isu Umum)**
| Error |	Penyebab Paling Umum |	Solusi |
| --- | --- | --- |
| **502 Bad Gateway** |	Aplikasi mati/crash (PM2) atau Nginx salah konfigurasi.	| Cek `pm2 logs library-api`. Jika crash, jalankan `npx prisma generate` dan restart PM2. |
| **404 Not Found**	| URL salah atau Nginx tidak terhubung ke Port 80.	| Pastikan Anda mengakses `http://3.225.47.3/api/...` dan cek _symlink_ Nginx. |
| **Prisma Error**	| `Prisma Client did not initialize yet...` |	Jalankan `npx prisma generate` di server EC2. |
| **ERR_MODULE_NOT_FOUND** |	Konflik case-sensitivity di Linux (huruf besar/kecil salah). |	Perbaiki case pada import path dan filename di server, lalu `pm2 restart library-api.` |

**3. Maintenance (Prosedur Update)**
Untuk menerapkan perubahan kode baru dari GitHub:
```Bash
# 1. Pindah ke direktori proyek
cd ~/Library_API

# 2. Tarik kode terbaru
git pull

# 3. Instal dependencies baru (jika ada)
npm install

# 4. Terapkan migrasi database baru (jika ada perubahan skema)
npx prisma migrate deploy

# 5. Restart aplikasi untuk memuat kode baru
pm2 restart library-api
```

