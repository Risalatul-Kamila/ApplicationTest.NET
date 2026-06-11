# 📄 Dokumentasi Project Pelindo
> Aplikasi Rekrutmen Karyawan PT Pelindo — ASP.NET Core 8

---

## 🔧 Framework & Library

### Backend — `Pelindo.API`
| Nama | Versi | Kegunaan |
|---|---|---|
| **ASP.NET Core** | 8.0 | Framework utama backend (Web API) |
| **Entity Framework Core** | 8.0.11 | ORM — mapping class C# ke tabel database |
| **Pomelo.EntityFrameworkCore.MySql** | 8.0.2 | Koneksi EF Core ke MySQL |
| **Microsoft.AspNetCore.Authentication.JwtBearer** | 8.0.0 | Autentikasi pakai JWT token |
| **BCrypt.Net-Next** | 4.2.0 | Hash password sebelum disimpan ke DB |
| **Swashbuckle (Swagger)** | 6.4.0 | Dokumentasi & testing API otomatis |

### Frontend — `Pelindo.MVC`
| Nama | Kegunaan |
|---|---|
| **ASP.NET Core MVC** | Framework tampilan dengan Razor Views |
| **Bootstrap** | CSS styling & komponen UI |
| **Bootstrap Icons** | Icon-icon di halaman |
| **Cookie Authentication** | Menyimpan sesi login di browser |

### Ringkasan Stack
| | |
|---|---|
| **Bahasa** | C# |
| **Runtime** | .NET 8 |
| **Database** | MySQL |
| **Pattern** | REST API + MVC (terpisah) |
| **Auth API** | JWT (JSON Web Token) |
| **Auth MVC** | Cookie Authentication |

---

## 🏗️ Arsitektur Sistem

Project ini menggunakan arsitektur **API + MVC terpisah**:

```
┌─────────────────────┐        HTTP/REST        ┌─────────────────────┐
│    Pelindo.MVC      │  ─────────────────────▶  │    Pelindo.API      │
│  (Frontend / View)  │  ◀─────────────────────  │  (Backend / Logic)  │
│   localhost:XXXXX   │        JSON Response      │   localhost:44348   │
└─────────────────────┘                          └──────────┬──────────┘
                                                            │
                                                    ┌───────▼───────┐
                                                    │  MySQL DB     │
                                                    │  db_pelindo   │
                                                    └───────────────┘
```

### Mengapa dipisah?
- **Pelindo.API** → murni backend, handle data, autentikasi, business logic
- **Pelindo.MVC** → murni tampilan, tidak langsung akses database, semua lewat API
- Keuntungan: API bisa dipakai ulang oleh mobile app, dll

---

## 🗃️ Struktur Database

### Tabel & Relasi

```
users (1) ──────── (1) biodatas
                        │
               ┌────────┼────────┐
               │        │        │
          pendidikans pelatihans pekerjaans
```

### Detail Tabel

#### `users`
| Kolom | Tipe | Keterangan |
|---|---|---|
| Id | int (PK) | Auto increment |
| Email | string | Unique, untuk login |
| Password | string | Di-hash dengan BCrypt |
| Role | string | `ADMIN` atau `USER` |

> ⚠️ **User pertama yang register otomatis jadi ADMIN**

#### `biodatas`
| Kolom | Tipe | Keterangan |
|---|---|---|
| Id | int (PK) | Auto increment |
| UserId | int (FK) | Relasi ke users |
| PosisiYangDilamar | string | Posisi yang dilamar |
| Nama | string | Nama lengkap |
| NoKtp | string | Nomor KTP |
| TempatLahir | string | Tempat lahir |
| TanggalLahir | string | Tanggal lahir |
| JenisKelamin | string | L / P |
| Agama | string | Agama |
| GolonganDarah | string | A/B/AB/O |
| Status | string | Status pernikahan |
| AlamatKtp | string | Alamat di KTP |
| AlamatTinggal | string | Alamat domisili |
| Email | string | Email pelamar |
| NoTelp | string | Nomor telepon |
| OrangTerdekat | string | Kontak darurat |
| Skill | string | Keahlian |
| BersediaDitempatkan | bool | Kesediaan ditempatkan |
| PenghasilanDiharapkan | string | Gaji yang diinginkan |
| CreatedAt | DateTime | Tanggal dibuat |
| UpdatedAt | DateTime | Tanggal diupdate |

#### `pendidikans`
| Kolom | Tipe |
|---|---|
| Id | int (PK) |
| BiodataId | int (FK) |
| Jenjang | string (SD/SMP/SMA/D3/S1/...) |
| NamaInstitusi | string |
| Jurusan | string |
| TahunMasuk | string |
| TahunLulus | string |
| Ipk | string |

#### `pelatihans`
| Kolom | Tipe |
|---|---|
| Id | int (PK) |
| BiodataId | int (FK) |
| NamaKursus | string |
| Penyelenggara | string |
| Sertifikat | bool |
| Tahun | string |

#### `pekerjaans`
| Kolom | Tipe |
|---|---|
| Id | int (PK) |
| BiodataId | int (FK) |
| NamaPerusahaan | string |
| Posisi | string |
| Gaji | string |
| TahunMasuk | string |
| TahunKeluar | string |
| AlasanKeluar | string |

---

## 🔐 Sistem Autentikasi

### Alur Login

```
User ──▶ MVC /Auth/Login ──▶ API /api/auth/login
                                    │
                            Verifikasi BCrypt
                                    │
                            Generate JWT Token
                                    │
                 ◀──────── return { token, role }
                 │
        Simpan di Cookie (ClaimsPrincipal)
        - ClaimTypes.Name = email
        - ClaimTypes.Role = ADMIN / USER
        - "Token" = JWT string
                 │
        Redirect berdasarkan role:
        - ADMIN ──▶ /Admin/Index
        - USER  ──▶ /Biodata/Index
```

### JWT Token
- **Library**: `Microsoft.AspNetCore.Authentication.JwtBearer`
- **Password Hashing**: `BCrypt.Net-Next`
- **Masa berlaku**: 1 hari
- **Konfigurasi** (appsettings.json):
```json
"Jwt": {
  "Key": "rahasia_negara_123_sangat_rahasia_sekali_minimal_32_karakter",
  "Issuer": "PelindoAPI",
  "Audience": "PelindoApp"
}
```

### Cara MVC kirim token ke API
Setiap request dari MVC ke API menyertakan token di header:
```csharp
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", token);
```

---

## 📁 Struktur File

### Pelindo.API
```
Pelindo.API/
├── Controllers/
│   ├── AuthController.cs      → Register & Login
│   ├── BiodataController.cs   → CRUD biodata user sendiri
│   └── AdminController.cs     → Kelola semua data (khusus ADMIN)
├── Models/
│   ├── ApplicationDbContext.cs → Konfigurasi EF Core + relasi
│   ├── User.cs                 → Model tabel users
│   ├── Biodata.cs              → Model tabel biodatas
│   ├── Pendidikan.cs           → Model tabel pendidikans
│   ├── Pelatihan.cs            → Model tabel pelatihans
│   └── Pekerjaan.cs            → Model tabel pekerjaans
├── Migrations/                 → File migrasi database (auto-generated)
├── Program.cs                  → Konfigurasi service & middleware
└── appsettings.json            → Koneksi DB + JWT config
```

### Pelindo.MVC
```
Pelindo.MVC/
├── Controllers/
│   ├── AuthController.cs      → Login, Register, Logout
│   ├── BiodataController.cs   → Tampilan form biodata user
│   └── AdminController.cs     → Dashboard admin + pencarian
├── Models/
│   ├── BiodataViewModel.cs    → ViewModel biodata + nested list
│   └── AuthViewModel.cs       → ViewModel login & register
├── Views/
│   ├── Admin/
│   │   ├── Index.cshtml       → Tabel data semua pelamar + search
│   │   └── Edit.cshtml        → Form edit data pelamar
│   ├── Auth/
│   │   ├── Login.cshtml
│   │   └── Register.cshtml
│   └── Biodata/
│       └── Index.cshtml       → Form isi biodata (user)
├── Program.cs                 → Setup HttpClient + Cookie Auth
└── appsettings.json
```

---

## 🔌 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Daftarkan user baru |
| POST | `/api/auth/login` | ❌ | Login, dapat token JWT |

**Register Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGc...",
  "role": "ADMIN"
}
```

---

### Biodata — `/api/biodata`

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/api/biodata/me` | ✅ USER | Ambil biodata milik sendiri |
| POST | `/api/biodata` | ✅ USER | Simpan/update biodata sendiri |
| PUT | `/api/biodata/{id}` | ✅ USER/ADMIN | Update biodata by id |

---

### Admin — `/api/admin` (khusus ADMIN)

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| GET | `/api/admin/biodata?search=` | ✅ ADMIN | Ambil semua data pelamar + filter |
| GET | `/api/admin/biodata/{id}` | ✅ ADMIN | Detail satu pelamar |
| PUT | `/api/admin/biodata/{id}` | ✅ ADMIN | Edit data pelamar |
| DELETE | `/api/admin/biodata/{id}` | ✅ ADMIN | Hapus pelamar (cascade ke user) |

**Fitur Search:**
```
GET /api/admin/biodata?search=S1
```
Mencari berdasarkan **Nama**, **Posisi yang Dilamar**, dan **Jenjang Pendidikan** secara bersamaan.

---

## 🖥️ Halaman MVC

| URL | Controller | Akses | Fungsi |
|---|---|---|---|
| `/Auth/Login` | AuthController | Semua | Form login |
| `/Auth/Register` | AuthController | Semua | Form registrasi |
| `/Auth/Logout` | AuthController | Login | Logout |
| `/Biodata` | BiodataController | USER | Isi / edit biodata sendiri |
| `/Admin` | AdminController | ADMIN | Lihat semua pelamar + cari |
| `/Admin/Edit/{id}` | AdminController | ADMIN | Edit data pelamar |

---

## ⚙️ Konfigurasi & Cara Jalankan

### Prasyarat
- .NET 8 SDK
- MySQL Server
- Visual Studio 2022

### appsettings.json (API)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=db_pelindo;user=root;password="
  },
  "Jwt": {
    "Key": "rahasia_negara_123_sangat_rahasia_sekali_minimal_32_karakter",
    "Issuer": "PelindoAPI",
    "Audience": "PelindoApp"
  }
}
```

### Cara Jalankan

1. Buka `Pelindo.API.sln` di Visual Studio → **F5** (API jalan di port 44348)
2. Buka `Pelindo.MVC.sln` di Visual Studio → **F5**
3. Database dibuat **otomatis** saat API pertama kali dijalankan (`db.Database.Migrate()`)

> ⚠️ Jalankan API dulu, baru MVC

---

## 🔑 Poin Teknis Penting (untuk Interview)

### 1. Cascade Delete
Hapus `User` → otomatis hapus `Biodata`, `Pendidikan`, `Pelatihan`, `Pekerjaan`.
```csharp
.OnDelete(DeleteBehavior.Cascade)
```

### 2. Role-Based Authorization
```csharp
[Authorize(Roles = "ADMIN")]  // hanya admin
[Authorize]                    // semua yang login
```

### 3. User pertama = ADMIN
```csharp
var isFirstUser = !await _context.Users.AnyAsync();
var role = isFirstUser ? "ADMIN" : "USER";
```

### 4. Update Pendidikan/Pelatihan/Pekerjaan
Strategi: **hapus semua lalu insert ulang** (bukan update satu per satu):
```csharp
_context.Pendidikans.RemoveRange(biodata.Pendidikan);
biodata.Pendidikan = dto.Pendidikan;
```

### 5. Search Admin (3 field sekaligus)
```csharp
query = query.Where(b =>
    b.Nama.Contains(search) ||
    b.PosisiYangDilamar.Contains(search) ||
    b.Pendidikan.Any(p => p.Jenjang.Contains(search))
);
```

### 6. MVC tidak akses DB langsung
Semua data diambil via HTTP ke API menggunakan `IHttpClientFactory`:
```csharp
var client = _clientFactory.CreateClient("ApiClient");
var response = await client.GetAsync("admin/biodata");
```

### 7. Token disimpan di Cookie
```csharp
new Claim("Token", result.Token)  // disimpan di claims
// diambil kembali saat request ke API:
var token = User.FindFirst("Token")?.Value;
```

### 8. Circular Reference JSON
Dihandle dengan `ReferenceHandler.IgnoreCycles` agar tidak infinite loop saat serialize objek yang saling referensi:
```csharp
x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles
```

---

## ❓ Pertanyaan yang Mungkin Ditanya

**Q: Kenapa pakai JWT di API tapi Cookie di MVC?**
> JWT di API karena API bersifat stateless dan bisa dikonsumsi siapa saja. Cookie di MVC karena browser-based dan lebih mudah dikelola untuk session.

**Q: Kenapa arsitekturnya dipisah API dan MVC?**
> Agar API bisa dipakai oleh aplikasi lain (mobile, dll). MVC hanya sebagai consumer, bukan satu-satunya client.

**Q: Bagaimana keamanan password?**
> Password di-hash menggunakan BCrypt sebelum disimpan. BCrypt menggunakan salt otomatis sehingga hash selalu berbeda meski password sama.

**Q: Apa itu EF Core dan Migration?**
> Entity Framework Core adalah ORM (Object-Relational Mapper) yang mengubah class C# menjadi tabel database. Migration adalah cara untuk membuat/mengubah struktur tabel dari kode tanpa perlu nulis SQL manual.

**Q: Bagaimana cara cek apakah user adalah ADMIN?**
> Role disimpan di JWT claims. Di API dicek via `[Authorize(Roles = "ADMIN")]`, di MVC dicek via `User.IsInRole("ADMIN")` atau cookie claims.
