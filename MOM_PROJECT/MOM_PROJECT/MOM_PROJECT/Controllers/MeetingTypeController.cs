using Microsoft.AspNetCore.Mvc;
using MOM_PROJECT.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;

namespace MOM_PROJECT.Controllers
{
    public class MeetingTypeController : Controller
    {
        private readonly string _connectionString =
            "Server=localhost;Database=MOM_PROJECT;User Id=SA;Password=Aniruddh18;TrustServerCertificate=True;";

        // GET: MeetingTypeList (no search)
        [HttpGet]
        public IActionResult MeetingTypeList()
        {
            List<MeetingTypeModel> list = GetMeetingTypes(null);
            return View(list);
        }

        // POST: MeetingTypeList (search via FormCollection)
        [HttpPost]
        public IActionResult MeetingTypeList(IFormCollection formData)
        {
            string searchText = formData["SearchText"].ToString();
            if (string.IsNullOrWhiteSpace(searchText))
                searchText = null;

            ViewBag.SearchText = searchText;
            List<MeetingTypeModel> list = GetMeetingTypes(searchText);
            return View(list);
        }

        // Shared helper
        private List<MeetingTypeModel> GetMeetingTypes(string? searchText)
        {
            List<MeetingTypeModel> list = new List<MeetingTypeModel>();

            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("PR_MOM_MeetingType_SelectAll", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@SearchText", (object?)searchText ?? DBNull.Value);

            con.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                MeetingTypeModel model = new MeetingTypeModel();
                model.MeetingTypeID = Convert.ToInt32(reader["MeetingTypeID"]);
                model.MeetingTypeName = reader["MeetingTypeName"].ToString();
                model.Remarks = reader["Remarks"]?.ToString();
                list.Add(model);
            }

            return list;
        }

        [HttpGet]
        public IActionResult MeetingTypeAddEdit(int id = 0)
        {
            MeetingTypeModel model = new MeetingTypeModel();

            if (id > 0)
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_MOM_MeetingType_SelectByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingTypeID", id);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    model.MeetingTypeID = id;
                    model.MeetingTypeName = reader["MeetingTypeName"].ToString();
                    model.Remarks = reader["Remarks"]?.ToString();
                }
            }

            return View(model);
        }

        [HttpPost]
        public IActionResult MeetingTypeSave(MeetingTypeModel model)
        {
            if (!ModelState.IsValid)
            {
                return View("MeetingTypeAddEdit", model);
            }

            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;

            if (model.MeetingTypeID > 0)
            {
                cmd.CommandText = "PR_MOM_MeetingType_UpdateByPK";
                cmd.Parameters.AddWithValue("@MeetingTypeID", model.MeetingTypeID);
            }
            else
            {
                cmd.CommandText = "PR_MOM_MeetingType_Insert";
                var insertUserIdStr = HttpContext.Session.GetString("UserID");
                cmd.Parameters.AddWithValue("@UserID",
                    string.IsNullOrEmpty(insertUserIdStr) ? (object)DBNull.Value : Convert.ToInt32(insertUserIdStr));
            }

            cmd.Parameters.AddWithValue("@MeetingTypeName", model.MeetingTypeName);
            cmd.Parameters.AddWithValue("@Remarks", (object?)model.Remarks ?? DBNull.Value);

            con.Open();
            cmd.ExecuteNonQuery();

            TempData["SuccessMessage"] =
                model.MeetingTypeID == 0
                    ? "Meeting type added successfully."
                    : "Meeting type updated successfully.";

            return RedirectToAction("MeetingTypeList");
        }

        public IActionResult DeleteMeetingType(int id)
        {
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_MOM_MeetingType_DeleteByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingTypeID", id);

                con.Open();
                cmd.ExecuteNonQuery();

                TempData["SuccessMessage"] = "Meeting type deleted successfully.";
            }
            catch (SqlException)
            {
                TempData["ErrorMessage"] =
                    "This meeting type cannot be deleted because it is linked with other records.";
            }

            return RedirectToAction("MeetingTypeList");
        }
    }
}