using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pelindo.API.Models
{
    public class Pekerjaan
    {
        [Key]
        public int Id { get; set; }
        
        public int BiodataId { get; set; }
        
        [ForeignKey("BiodataId")]
        public Biodata? Biodata { get; set; }
        
        public string? NamaPerusahaan { get; set; }
        public string? Posisi { get; set; }
        public string? Gaji { get; set; }
        public string? TahunMasuk { get; set; }
        public string? TahunKeluar { get; set; }
        public string? AlasanKeluar { get; set; }
    }
}
