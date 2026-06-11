using System.ComponentModel.DataAnnotations;

namespace Pelindo.MVC.Models
{
    public class RegisterViewModel
    {
        [Required(ErrorMessage = "Email harus diisi")]
        [EmailAddress(ErrorMessage = "Format email tidak valid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password harus diisi")]
        public string Password { get; set; }
    }

    public class LoginViewModel
    {
        [Required(ErrorMessage = "Email harus diisi")]
        [EmailAddress(ErrorMessage = "Format email tidak valid")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password harus diisi")]
        public string Password { get; set; }
    }

    public class AuthResponse
    {
        public string Token { get; set; }
        public string Role { get; set; }
        public string Error { get; set; }
    }
}
