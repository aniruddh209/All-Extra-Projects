using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using MOM_PROJECT.Models;
using System.Data;

namespace MOM_PROJECT.Controllers
{
    [AllowAnonymous]
    public class AccountController : Controller
    {
        private readonly string _connectionString =
            "Server=localhost;Database=MOM_PROJECT;User Id=SA;Password=Aniruddh18;TrustServerCertificate=True;";

        private readonly IWebHostEnvironment _env;

        public AccountController(IWebHostEnvironment env)
        {
            _env = env;
        }
        
        [HttpGet]
        public IActionResult Login()
        {
            if (HttpContext.Session.GetString("UserID") != null)
            {
                // Admin users always go to admin panel
                var role = HttpContext.Session.GetString("UserRole") ?? "";
                if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
                    return RedirectToAction("AdminDashboard", "Admin");

                return RedirectToAction("Index", "Home");
            }
            return View(new UserModel());
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Login(UserModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = con.CreateCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "PR_MST_User_Login";
                cmd.Parameters.AddWithValue("@Username", model.Username);
                cmd.Parameters.AddWithValue("@Password", model.Password);

                con.Open();
                using SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    string role = reader["Role"].ToString() ?? "Member";

                    // Block admin users from member login — admin must use admin toggle
                    if (string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
                    {
                        ModelState.AddModelError(string.Empty, "❌ This is an Administrator account. Please select Admin Login instead.");
                        return View(model);
                    }

                    HttpContext.Session.SetString("UserID",       reader["UserID"].ToString()!);
                    HttpContext.Session.SetString("UserName",     reader["Username"].ToString()!);
                    HttpContext.Session.SetString("UserRole",     role);
                    HttpContext.Session.SetString("ProfilePhoto", reader["ProfilePhoto"]?.ToString() ?? "");

                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "❌ Invalid username or password.");
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, "Something went wrong: " + ex.Message);
            }

            return View(model);
        }
        
        [HttpGet]
        public IActionResult Register()
        {
            if (HttpContext.Session.GetString("UserID") != null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View(new RegisterModel());
        }

     
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Register(RegisterModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = con.CreateCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "PR_MST_User_Register";
                cmd.Parameters.AddWithValue("@Username", model.Username);
                cmd.Parameters.AddWithValue("@Password", model.Password);
                cmd.Parameters.AddWithValue("@Role", "Member"); // Only Admins can create Admin accounts

                con.Open();
                using SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    HttpContext.Session.SetString("UserID", reader["UserID"].ToString());
                    HttpContext.Session.SetString("UserName", reader["Username"].ToString());
                    HttpContext.Session.SetString("UserRole", reader["Role"].ToString());
                    HttpContext.Session.SetString("ProfilePhoto", reader["ProfilePhoto"]?.ToString() ?? "");

                    TempData["SuccessMessage"] = "Account created successfully! Welcome aboard.";
                    return RedirectToAction("Index", "Home");
                }
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("Username already exists"))
                {
                    ModelState.AddModelError("Username", "This username is already taken. Try another one.");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Registration failed: " + ex.Message);
                }
            }

            return View(model);
        }

       
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "Account");
        }


        public IActionResult Profile()
        {
            ViewBag.FullName = HttpContext.Session.GetString("UserName") ?? "User";
            ViewBag.Company = "MOM IT Solutions";
            ViewBag.Job = HttpContext.Session.GetString("UserRole") ?? "Member";
            ViewBag.Country = "India";
            ViewBag.Phone = "+91 98765 43210";
            ViewBag.Email = (HttpContext.Session.GetString("UserName") ?? "user") + "@mom.com";
            ViewBag.ProfilePhoto = HttpContext.Session.GetString("ProfilePhoto") ?? "";
            return View();
        }

    
        [HttpPost]
        public IActionResult UpdateProfile(string fullNameInput, string companyInput, string jobInput,
            string countryInput, string phoneInput, string emailInput, IFormFile? ProfilePhotoFile)
        {
            string? photoPath = HttpContext.Session.GetString("ProfilePhoto");

            // Handle file upload
            if (ProfilePhotoFile != null && ProfilePhotoFile.Length > 0)
            {
                string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                string fileName = Guid.NewGuid() + Path.GetExtension(ProfilePhotoFile.FileName);
                string fullPath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    ProfilePhotoFile.CopyTo(stream);
                }

                photoPath = "/uploads/" + fileName;
            }

            // Save photo path to DB
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_MST_User_UpdateProfile", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserID", Convert.ToInt32(userIdStr));
                cmd.Parameters.AddWithValue("@ProfilePhoto", (object?)photoPath ?? DBNull.Value);

                con.Open();
                cmd.ExecuteNonQuery();

                // Update session
                HttpContext.Session.SetString("ProfilePhoto", photoPath ?? "");
            }

            TempData["SuccessMessage"] = "Profile updated successfully!";
            return RedirectToAction("Profile");
        }


        [HttpPost]
        public IActionResult RemoveProfilePhoto()
        {
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
            {
                // Delete old file from disk
                string? oldPhoto = HttpContext.Session.GetString("ProfilePhoto");
                if (!string.IsNullOrEmpty(oldPhoto))
                {
                    string oldFilePath = Path.Combine(_env.WebRootPath, oldPhoto.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                        System.IO.File.Delete(oldFilePath);
                }

                // Set NULL in DB
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_MST_User_UpdateProfile", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserID", Convert.ToInt32(userIdStr));
                cmd.Parameters.AddWithValue("@ProfilePhoto", DBNull.Value);

                con.Open();
                cmd.ExecuteNonQuery();

                HttpContext.Session.SetString("ProfilePhoto", "");
            }

            TempData["SuccessMessage"] = "Profile photo removed successfully!";
            return RedirectToAction("Profile");
        }
    }
}