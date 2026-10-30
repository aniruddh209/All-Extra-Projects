using Microsoft.AspNetCore.Mvc;

namespace AdminPannnel.Controllers;

public class HomeController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}