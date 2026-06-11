using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pelindo.API.Models
{
    public class Biodata
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }
        
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
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public List<Pendidikan>? Pendidikan { get; set; } = new List<Pendidikan>();
        public List<Pelatihan>? Pelatihan { get; set; } = new List<Pelatihan>();
        public List<Pekerjaan>? Pekerjaan { get; set; } = new List<Pekerjaan>();
    }
}
