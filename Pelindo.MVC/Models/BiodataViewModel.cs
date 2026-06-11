using System.Collections.Generic;

namespace Pelindo.MVC.Models
{
    public class BiodataViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        public string? PosisiYangDilamar { get; set; }
        public string? Nama { get; set; }
        public string? NoKtp { get; set; }
        public string? TempatLahir { get; set; }
        public string? TanggalLahir { get; set; }
        public string? JenisKelamin { get; set; }
        public string? Agama { get; set; }
        public string? GolonganDarah { get; set; }
        public string? Status { get; set; }
        public string? AlamatKtp { get; set; }
        public string? AlamatTinggal { get; set; }
        public string? Email { get; set; }
        public string? NoTelp { get; set; }
        public string? OrangTerdekat { get; set; }
        public string? Skill { get; set; }
        public bool? BersediaDitempatkan { get; set; }
        public string? PenghasilanDiharapkan { get; set; }
        
        public List<PendidikanViewModel> Pendidikan { get; set; } = new List<PendidikanViewModel>();
        public List<PelatihanViewModel> Pelatihan { get; set; } = new List<PelatihanViewModel>();
        public List<PekerjaanViewModel> Pekerjaan { get; set; } = new List<PekerjaanViewModel>();
    }

    public class PendidikanViewModel
    {
        public int Id { get; set; }
        public string? Jenjang { get; set; }
        public string? NamaInstitusi { get; set; }
        public string? Jurusan { get; set; }
        public string? TahunMasuk { get; set; }
        public string? TahunLulus { get; set; }
        public string? Ipk { get; set; }
    }

    public class PelatihanViewModel
    {
        public int Id { get; set; }
        public string? NamaKursus { get; set; }
        public string? Penyelenggara { get; set; }
        public bool? Sertifikat { get; set; }
        public string? Tahun { get; set; }
    }

    public class PekerjaanViewModel
    {
        public int Id { get; set; }
        public string? NamaPerusahaan { get; set; }
        public string? Posisi { get; set; }
        public string? Gaji { get; set; }
        public string? TahunMasuk { get; set; }
        public string? TahunKeluar { get; set; }
        public string? AlasanKeluar { get; set; }
    }
}
