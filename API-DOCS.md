# 📚 API DOCUMENTATION: Library Management System (LMS)

## 🔗 Basis URL: `/api`

Aplikasi ini menggunakan Node.js (v18+), Express.js, dan Prisma ORM.

---

## I. Format Respons & Error Handling

Semua respons API (sukses dan error) mengikuti struktur terstandarisasi.

### A. Respons Sukses (HTTP 200, 201, 204)
| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `success` | Boolean | `true` |
| `message` | String | Pesan deskriptif operasi. |
| `data` | Object/Array | Data yang dikembalikan (Dihilangkan untuk 204 No Content). |
| `pagination` | Object | Metadata pagination (Hanya pada List Endpoints). |

### B. Respons Error (HTTP 4xx, 5xx)
| Status Code | Tipe Error | Keterangan |
| :--- | :--- | :--- |
| **400** | Bad Request | Gagal Validasi Input (termasuk detail di `errors`). |
| **401** | Unauthorized | Token hilang, tidak valid, atau kedaluwarsa. |
| **403** | Forbidden | Token valid, tetapi peran (`USER`) tidak memiliki izin (`ADMIN`). |
| **404** | Not Found | Resource tidak ditemukan (termasuk error Prisma P2025). |
| **409** | Conflict | Konflik data unik (e.g., Email sudah terdaftar, Prisma P2002). |
| **500** | Server Error | Masalah Internal Server. |

---

## II. Otorisasi (Authentication & RBAC)

Semua permintaan yang dilindungi harus menyertakan `Authorization: Bearer <ACCESS_TOKEN>`.

| Middleware | Deskripsi | Status Code Jika Gagal |
| :--- | :--- | :--- |
| **`authMiddleware`** | Memverifikasi Access Token. | 401 Unauthorized |
| **`requireRole(["ADMIN"])`**| Memastikan peran pengguna adalah `ADMIN`. | 403 Forbidden |
| **Ownership** | Membandingkan `req.user.userId` dengan `resource.userId`. | 403 Forbidden |
| **Admin Bypass** | Pengguna **ADMIN** otomatis melewati semua cek peran dan kepemilikan. | N/A |

---

## III. Query Parameter (List Endpoints)

Berlaku untuk semua `GET` List Endpoints (e.g., `/books`, `/users`, `/loans`).

| Parameter | Tipe | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `page` | Integer | `1` | Nomor halaman yang diminta. |
| `limit` | Integer | `10` (Max 50) | Jumlah item per halaman. |
| `sortBy` | String | `createdAt` | Field untuk sorting (e.g., `title`, `name`). |
| `order` | String | `asc` | Urutan sorting (`asc` atau `desc`). |
| `search` | String | - | Pencarian teks *case-insensitive* pada *field* yang diizinkan. |

---

## IV. Endpoint Detail

### 1. Auth & Token Management

| Method | Endpoint | Deskripsi | Auth? | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| **`POST`** | `/auth/register` | Membuat akun pengguna baru (`role: USER`). | ❌ | - |
| **`POST`** | `/auth/login` | Login, mengembalikan `accessToken` dan `refreshToken`. | ❌ | - |
| **`POST`** | `/auth/refresh` | Mendapatkan `accessToken` baru menggunakan `refreshToken`. | ❌ | - |
| **`GET`** | `/auth/me` | Mendapatkan profil pengguna yang sedang login. | ✅ | USER/ADMIN |

---

### 2. Book, Author, Category

| Method | Endpoint | Deskripsi | Auth? | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/books` | List buku dengan pagination. | ❌ | - |
| **`POST`** | `/books` | Membuat buku baru (termasuk relasi M:M). | ✅ | ADMIN |
| **`PUT`** | `/books/:id` | Memperbarui buku dan relasi M:M. | ✅ | ADMIN |
| **`DELETE`**| `/books/:id` | Menghapus buku (Cascade Delete). | ✅ | ADMIN |
| **`GET` | `/authors`, `/categories` | List Penulis / Kategori. | ❌ | - |
| **`POST`** | `/authors`, `/categories` | Membuat Penulis / Kategori baru. | ✅ | ADMIN |

---

### 3. Book Copy (Salinan Fisik)

| Method | Endpoint | Deskripsi | Auth? | Role Required |
| :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/copies` | List semua salinan fisik. | ❌ | - |
| **`POST`** | `/copies` | Menambahkan salinan fisik baru (`barcode`, `bookId`). | ✅ | ADMIN |
| **`PUT`** | `/copies/:id` | Mengubah status salinan (e.g., ke `MAINTENANCE`). | ✅ | ADMIN |
| **`DELETE`**| `/copies/:id` | Menghapus salinan fisik. | ✅ | ADMIN |

---

### 4. Loan (Peminjaman & Pengembalian)

| Method | Endpoint | Deskripsi | Auth? | Role Required | Catatan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`POST`** | `/loans/borrow` | Membuat pinjaman baru. | ✅ | USER/ADMIN | Otomatis set `status: ONGOING`. |
| **`POST`** | `/loans/:id/return`| Mengembalikan pinjaman. | ✅ | USER/ADMIN | User hanya bisa mengembalikan pinjaman miliknya. |
| **`GET`** | `/loans/me` | List pinjaman milik pengguna yang login. | ✅ | USER/ADMIN | - |
| **`GET`** | `/loans` | List semua pinjaman dalam sistem (Admin View). | ✅ | ADMIN | - |

---

### 5. User Management (Oleh Admin)

| Method | Endpoint | Deskripsi | Auth? | Role Required | Catatan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`GET`** | `/users` | List semua pengguna. | ✅ | ADMIN | - |
| **`GET`** | `/users/:id` | Detail pengguna. | ✅ | ADMIN/Owner | - |
| **`POST`** | `/users` | Membuat akun pengguna baru (oleh Admin). | ✅ | ADMIN | - |
| **`PUT`** | `/users/:id` | Memperbarui detail pengguna (termasuk role). | ✅ | ADMIN/Owner | - |
| **`DELETE`**| `/users/:id` | Menghapus akun pengguna. | ✅ | ADMIN | Admin tidak bisa menghapus diri sendiri. |
