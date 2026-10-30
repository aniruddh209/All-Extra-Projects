using Microsoft.AspNetCore.Mvc;
using MOM_PROJECT.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;

namespace MOM_PROJECT.Controllers
{
    public class DepartmentController : Controller
    {
        private readonly string _connectionString =
            "Server=localhost,1433;Database=MOM_PROJECT;User Id=sa;Password=Aniruddh18;MultipleActiveResultSets=true;TrustServerCertificate=True;";

        private readonly IWebHostEnvironment _env;

        public DepartmentController(IWebHostEnvironment env)
        {
            _env = env;
        }

        // GET: DepartmentList (no search)
        [HttpGet]
        public IActionResult DepartmentList()
        {
            List<DepartmentModel> list = GetDepartments(null);
            return View(list);
        }

        // POST: DepartmentList (search via FormCollection)
        [HttpPost]
        public IActionResult DepartmentList(IFormCollection formData)
        {
            string searchText = formData["SearchText"].ToString();
            if (string.IsNullOrWhiteSpace(searchText))
                searchText = null;

            ViewBag.SearchText = searchText;
            List<DepartmentModel> list = GetDepartments(searchText);
            return View(list);
        }

        // Shared helper
        private List<DepartmentModel> GetDepartments(string? searchText)
        {
            List<DepartmentModel> list = new List<DepartmentModel>();

            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("PR_MOM_Department_SelectAll", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@SearchText", (object?)searchText ?? DBNull.Value);

            con.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                DepartmentModel model = new DepartmentModel();
                model.DepartmentID = Convert.ToInt32(reader["DepartmentID"]);
                model.DepartmentName = reader["DepartmentName"].ToString();
                model.DepartmentLogo = reader["DepartmentLogo"]?.ToString();
                list.Add(model);
            }

            return list;
        }

        // ============================
        //    DEPARTMENT VIEW (Details)
        // ============================
        public IActionResult DepartmentView(int id)
        {
            DepartmentModel model = new DepartmentModel();

            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            using SqlConnection con = new SqlConnection(_connectionString);
            con.Open();

            using SqlCommand cmd = new SqlCommand("PR_MOM_Department_SelectByPK", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@DepartmentID", id);

            SqlDataReader reader = cmd.ExecuteReader();

            if (reader.Read())
            {
                model.DepartmentID = Convert.ToInt32(reader["DepartmentID"]);
                model.DepartmentName = reader["DepartmentName"].ToString();
                model.DepartmentLogo = reader["DepartmentLogo"]?.ToString();
                model.Created = reader["Created"] != DBNull.Value ? Convert.ToDateTime(reader["Created"]) : DateTime.Now;
                model.Modified = reader["Modified"] != DBNull.Value ? Convert.ToDateTime(reader["Modified"]) : DateTime.Now;
            }
            reader.Close();

            // Staff count
            using SqlCommand staffCountCmd = new SqlCommand(
                "SELECT COUNT(*) FROM MOM_Staff WHERE DepartmentID = @DeptID" +
                (userId.HasValue ? " AND UserID = @UserID" : ""), con);
            staffCountCmd.Parameters.AddWithValue("@DeptID", id);
            if (userId.HasValue) staffCountCmd.Parameters.AddWithValue("@UserID", userId.Value);
            ViewBag.StaffCount = (int)staffCountCmd.ExecuteScalar();

            // Meeting count
            using SqlCommand meetCountCmd = new SqlCommand(
                "SELECT COUNT(*) FROM MOM_Meetings WHERE DepartmentID = @DeptID" +
                (userId.HasValue ? " AND UserID = @UserID" : ""), con);
            meetCountCmd.Parameters.AddWithValue("@DeptID", id);
            if (userId.HasValue) meetCountCmd.Parameters.AddWithValue("@UserID", userId.Value);
            ViewBag.MeetingCount = (int)meetCountCmd.ExecuteScalar();

            // Upcoming meetings count
            using SqlCommand upcomingCmd = new SqlCommand(
                "SELECT COUNT(*) FROM MOM_Meetings WHERE DepartmentID = @DeptID AND MeetingDate >= GETDATE() AND IsCancelled = 0" +
                (userId.HasValue ? " AND UserID = @UserID" : ""), con);
            upcomingCmd.Parameters.AddWithValue("@DeptID", id);
            if (userId.HasValue) upcomingCmd.Parameters.AddWithValue("@UserID", userId.Value);
            ViewBag.UpcomingCount = (int)upcomingCmd.ExecuteScalar();

            // Staff list
            List<StaffModel> staffList = new List<StaffModel>();
            using SqlCommand staffCmd = new SqlCommand(
                "SELECT StaffID, StaffName, Remarks, EmailAddress FROM MOM_Staff WHERE DepartmentID = @DeptID" +
                (userId.HasValue ? " AND UserID = @UserID" : "") + " ORDER BY StaffName", con);
            staffCmd.Parameters.AddWithValue("@DeptID", id);
            if (userId.HasValue) staffCmd.Parameters.AddWithValue("@UserID", userId.Value);
            SqlDataReader staffReader = staffCmd.ExecuteReader();
            while (staffReader.Read())
            {
                staffList.Add(new StaffModel
                {
                    StaffID = Convert.ToInt32(staffReader["StaffID"]),
                    StaffName = staffReader["StaffName"].ToString(),
                    Remarks = staffReader["Remarks"]?.ToString(),
                    EmailAddress = staffReader["EmailAddress"].ToString()
                });
            }
            staffReader.Close();
            ViewBag.StaffList = staffList;

            return View(model);
        }

        [HttpGet]
        public IActionResult DepartmentAddEdit(int? id)
        {
            DepartmentModel model = new DepartmentModel();

            if (id.HasValue && id > 0)
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_MOM_Department_SelectByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DepartmentID", id.Value);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    model.DepartmentID = Convert.ToInt32(reader["DepartmentID"]);
                    model.DepartmentName = reader["DepartmentName"].ToString();
                    model.DepartmentLogo = reader["DepartmentLogo"]?.ToString();
                }
            }

            return View(model);
        }

        [HttpPost]
        public IActionResult DepartmentAddEdit(DepartmentModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            // Handle file upload
            string? logoPath = model.DepartmentLogo;

            if (model.LogoFile != null && model.LogoFile.Length > 0)
            {
                string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                string fileName = Guid.NewGuid() + Path.GetExtension(model.LogoFile.FileName);
                string fullPath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    model.LogoFile.CopyTo(stream);
                }

                logoPath = "/uploads/" + fileName;
            }

            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;

            if (model.DepartmentID > 0)
            {
                cmd.CommandText = "PR_MOM_Department_UpdateByPK";
                cmd.Parameters.AddWithValue("@DepartmentID", model.DepartmentID);
            }
            else
            {
                cmd.CommandText = "PR_MOM_Department_Insert";
                var insertUserIdStr = HttpContext.Session.GetString("UserID");
                cmd.Parameters.AddWithValue("@UserID",
                    string.IsNullOrEmpty(insertUserIdStr) ? (object)DBNull.Value : Convert.ToInt32(insertUserIdStr));
            }

            cmd.Parameters.AddWithValue("@DepartmentName", model.DepartmentName);
            cmd.Parameters.AddWithValue("@DepartmentLogo", (object?)logoPath ?? DBNull.Value);

            con.Open();
            try
            {
                cmd.ExecuteNonQuery();
            }
            catch (SqlException ex)
            {
                ModelState.AddModelError(string.Empty, ex.Message);
                return View(model);
            }

            TempData["SuccessMessage"] =
                model.DepartmentID > 0
                    ? "Department updated successfully."
                    : "Department added successfully.";

            return RedirectToAction("DepartmentList");
        }

        public IActionResult DeleteDepartment(int id)
        {
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_MOM_Department_DeleteByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DepartmentID", id);

                con.Open();
                cmd.ExecuteNonQuery();

                TempData["SuccessMessage"] = "Department deleted successfully.";
            }
            catch (SqlException ex)
            {
                TempData["ErrorMessage"] = ex.Message;
            }

            return RedirectToAction("DepartmentList");
        }
    }
}