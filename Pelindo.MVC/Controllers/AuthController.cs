using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Pelindo.MVC.Models;

namespace Pelindo.MVC.Controllers
{
    public class AuthController : Controller
    {
        private readonly IHttpClientFactory _clientFactory;

        public AuthController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid) return View(model);

            var client = _clientFactory.CreateClient("ApiClient");
            var content = new StringContent(JsonSerializer.Serialize(model), Encoding.UTF8, "application/json");

            var response = await client.PostAsync("auth/login", content);
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<AuthResponse>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, model.Email),
                    new Claim(ClaimTypes.Role, result.Role),
                    new Claim("Token", result.Token)
                };

                var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity));

                if (result.Role == "ADMIN")
                    return RedirectToAction("Index", "Admin");
                else
                    return RedirectToAction("Index", "Biodata");
            }

            ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            return View(model);
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (!ModelState.IsValid) return View(model);

            var client = _clientFactory.CreateClient("ApiClient");
            var content = new StringContent(JsonSerializer.Serialize(model), Encoding.UTF8, "application/json");

            var response = await client.PostAsync("auth/register", content);
            if (response.IsSuccessStatusCode)
            {
                TempData["SuccessMessage"] = "Registrasi berhasil! Silakan login.";
                return RedirectToAction("Login");
            }

            ModelState.AddModelError(string.Empty, "Registration failed or email already exists.");
            return View(model);
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login");
        }
    }
}
