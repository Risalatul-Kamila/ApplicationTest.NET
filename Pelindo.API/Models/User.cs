using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pelindo.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
        
        public string Role { get; set; } = "USER";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public Biodata? Biodata { get; set; }
    }
}
