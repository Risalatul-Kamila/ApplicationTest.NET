using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pelindo.API.Models
{
    public class Pendidikan
    {
        [Key]
        public int Id { get; set; }
        
        public int BiodataId { get; set; }
        
        [ForeignKey("BiodataId")]
        public Biodata? Biodata { get; set; }
        
        public string? Jenjang { get; set; }
        public string? NamaInstitusi { get; set; }
        public string? Jurusan { get; set; }
        public string? TahunMasuk { get; set; }
        public string? TahunLulus { get; set; }
        public string? Ipk { get; set; }
    }
}
