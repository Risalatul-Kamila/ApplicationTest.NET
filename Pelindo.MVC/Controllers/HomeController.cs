using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Pelindo.MVC.Models;

namespace Pelindo.MVC.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        if (!User.Identity.IsAuthenticated)
            return RedirectToAction("Login", "Auth");

        if (User.IsInRole("ADMIN"))
            return RedirectToAction("Index", "Admin");

        return RedirectToAction("Index", "Biodata");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
