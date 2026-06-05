# Biodata Calon Karyawan APP (PELINDO)

Aplikasi *Fullstack* untuk pendaftaran dan manajemen biodata calon karyawan. Dibuat menggunakan React (Vite) untuk Frontend dan Node.js (Express) dengan Prisma ORM untuk Backend.

## Akses Admin (Untuk Keperluan Review HRD)

Gunakan kredensial berikut untuk login dan mengakses **Admin Dashboard**:

- **Email**: `admin.hrd@pelindo.com`
- **Password**: `password123`

## Struktur Proyek

- `/frontend` - Aplikasi React (Vite, TypeScript, Bootstrap)
- `/backend`  - API Server (Express.js, TypeScript, SQLite, Prisma)

## Cara Menjalankan Aplikasi Secara Lokal

### 1. Menjalankan Backend
Buka terminal baru, masuk ke direktori `backend`, lalu jalankan:
```bash
cd backend
npm install
npx prisma generate
npm run dev
```
*Server backend akan berjalan di http://localhost:3001*

### 2. Menjalankan Frontend
Buka terminal baru, masuk ke direktori `frontend`, lalu jalankan:
```bash
cd frontend
npm install
npm run dev
```
*Aplikasi frontend akan terbuka di browser secara otomatis (biasanya di http://localhost:5173).*