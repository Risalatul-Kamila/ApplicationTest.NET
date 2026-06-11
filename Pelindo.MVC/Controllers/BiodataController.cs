using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pelindo.MVC.Models;

namespace Pelindo.MVC.Controllers
{
    [Authorize]
    public class BiodataController : Controller
    {
        private readonly IHttpClientFactory _clientFactory;

        public BiodataController(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        private HttpClient GetClient()
        {
            var client = _clientFactory.CreateClient("ApiClient");
            var token = User.FindFirst("Token")?.Value;
            if (!string.IsNullOrEmpty(token))
            {
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }
            return client;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var client = GetClient();
            var response = await client.GetAsync("biodata/me");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var biodata = JsonSerializer.Deserialize<BiodataViewModel>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return View(biodata);
            }

            return View(new BiodataViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> Save(BiodataViewModel model)
        {
            var client = GetClient();
            var content = new StringContent(JsonSerializer.Serialize(model), Encoding.UTF8, "application/json");

            var response = await client.PostAsync("biodata", content);
            
            if (response.IsSuccessStatusCode)
            {
                TempData["Message"] = "Data berhasil disimpan!";
                TempData["IsSuccess"] = true;
            }
            else
            {
                TempData["Message"] = "Gagal menyimpan data.";
                TempData["IsSuccess"] = false;
            }

            return RedirectToAction("Index");
        }
    }
}
