using Microsoft.AspNetCore.Mvc;

namespace AdminPannnel.Controllers;

public class Components : Controller
{
    // GET
    public IActionResult components()
    {
        return View("Components");
    }
}