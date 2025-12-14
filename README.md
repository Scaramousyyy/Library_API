# 📚 Library Management System API (LMS Pemweb)

API ini dikembangkan menggunakan Node.js (Express) dengan database SQLite dan menggunakan arsitektur modular untuk mengelola data perpustakaan (Buku, Pengguna, Peminjaman).

## 🚀 Status Deployment

Aplikasi API ini telah berhasil di-deploy ke AWS EC2 dan dikelola oleh PM2 di belakang Nginx.

| Endpoint | URL | Keterangan |
| :--- | :--- | :--- |
| **Base URL API** | `http://3.225.47.3/api` | Semua endpoint API dimulai dari sini. |
| **Health Check** | `http://3.225.47.3/api/health` | Untuk mengecek status server. |

**Catatan:** URL di atas akan aktif minimal 2 minggu setelah deadline pengumpulan.

## 🛠️ Stack Teknologi

* **Runtime:** Node.js (v18+)
* **Framework:** Express.js
* **Database:** SQLite (via Prisma ORM)
* **Authentication:** JWT (JSON Web Tokens)
* **Deployment Tools:** PM2 (Process Manager), Nginx (Reverse Proxy)

## 💻 Panduan Local Setup

Ikuti langkah-langkah ini untuk menjalankan API di komputer lokal Anda:

1.  **Clone Repository:**
    ```bash
    git https://github.com/Scaramousyyy/Library_API
    cd Library_API
    ```

2.  **Instal Dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Environment:**
    Salin file `.env.example` menjadi `.env` dan isi variabel yang diperlukan.

4.  **Database Setup:**
    Jalankan perintah untuk membuat skema database lokal dan mengisi data awal.
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    npm run seed
    ```

5.  **Jalankan Aplikasi:**
    ```bash
    npm run dev
    ```

