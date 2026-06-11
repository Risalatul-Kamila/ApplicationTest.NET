using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Pelindo.MVC.Models;

namespace Pelindo.MVC.Controllers
{
    [Authorize(Roles = "ADMIN")]
    public class AdminController : Controller
    {
        private readonly IHttpClientFactory _clientFactory;

        public AdminController(IHttpClientFactory clientFactory)
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
        public async Task<IActionResult> Index(string search = "")
        {
            var client = GetClient();
            var response = await client.GetAsync($"admin/biodata?search={Uri.EscapeDataString(search)}");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var list = JsonSerializer.Deserialize<List<BiodataViewModel>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                ViewBag.Search = search;
                return View(list);
            }

            return View(new List<BiodataViewModel>());
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var client = GetClient();
            var response = await client.GetAsync($"admin/biodata/{id}");
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var biodata = JsonSerializer.Deserialize<BiodataViewModel>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                return View("Edit", biodata);
            }

            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, BiodataViewModel model)
        {
            var client = GetClient();
            var content = new StringContent(JsonSerializer.Serialize(model), Encoding.UTF8, "application/json");

            var response = await client.PutAsync($"admin/biodata/{id}", content);
            
            if (response.IsSuccessStatusCode)
            {
                TempData["Message"] = "Data pelamar berhasil diperbarui!";
                TempData["IsSuccess"] = true;
                return RedirectToAction("Index");
            }

            TempData["Message"] = "Gagal memperbarui data.";
            TempData["IsSuccess"] = false;
            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int id)
        {
            var client = GetClient();
            var response = await client.DeleteAsync($"admin/biodata/{id}");
            
            if (response.IsSuccessStatusCode)
            {
                TempData["Message"] = "Data pelamar berhasil dihapus!";
                TempData["IsSuccess"] = true;
            }

            return RedirectToAction("Index");
        }
    }
}
