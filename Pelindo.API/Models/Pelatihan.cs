using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pelindo.API.Models
{
    public class Pelatihan
    {
        [Key]
        public int Id { get; set; }
        
        public int BiodataId { get; set; }
        
        [ForeignKey("BiodataId")]
        public Biodata? Biodata { get; set; }
        
        public string? NamaKursus { get; set; }
        public string? Penyelenggara { get; set; }
        public bool? Sertifikat { get; set; }
        public string? Tahun { get; set; }
    }
}
