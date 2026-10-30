using Microsoft.AspNetCore.Mvc;
using MOM_PROJECT.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;

namespace MOM_PROJECT.Controllers
{
    public class MeetingVenueController : Controller
    {
        private readonly string _connectionString =
            "Server=localhost;Database=MOM_PROJECT;User Id=SA;Password=Aniruddh18;TrustServerCertificate=True;";

        // GET: MeetingVenueList (no search)
        [HttpGet]
        public IActionResult MeetingVenueList()
        {
            List<MeetingVenueModel> list = GetMeetingVenues(null);
            return View(list);
        }

        // POST: MeetingVenueList (search via FormCollection)
        [HttpPost]
        public IActionResult MeetingVenueList(IFormCollection formData)
        {
            string searchText = formData["SearchText"].ToString();
            if (string.IsNullOrWhiteSpace(searchText))
                searchText = null;

            ViewBag.SearchText = searchText;
            List<MeetingVenueModel> list = GetMeetingVenues(searchText);
            return View(list);
        }

        // Shared helper
        private List<MeetingVenueModel> GetMeetingVenues(string? searchText)
        {
            List<MeetingVenueModel> list = new List<MeetingVenueModel>();

            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand("PR_MOM_MeetingVenue_SelectAll", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@SearchText", (object?)searchText ?? DBNull.Value);

            con.Open();
            SqlDataReader reader = cmd.ExecuteReader();

            while (reader.Read())
            {
                MeetingVenueModel model = new MeetingVenueModel();
                model.MeetingVenueID = Convert.ToInt32(reader["MeetingVenueID"]);
                model.MeetingVenueName = reader["MeetingVenueName"].ToString();
                model.Created = Convert.ToDateTime(reader["Created"]);
                list.Add(model);
            }

            return list;
        }

        [HttpGet]
        public IActionResult MeetingVenueAddEdit(int id = 0)
        {
            MeetingVenueModel model = new MeetingVenueModel();

            if (id > 0)
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_MOM_MeetingVenue_SelectByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingVenueID", id);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    model.MeetingVenueID = id;
                    model.MeetingVenueName = reader["MeetingVenueName"].ToString();
                }
            }

            return View(model);
        }

        [HttpPost]
        public IActionResult MeetingVenueAddEdit(MeetingVenueModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            using SqlConnection con = new SqlConnection(_connectionString);
            using SqlCommand cmd = new SqlCommand();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;

            if (model.MeetingVenueID > 0)
            {
                cmd.CommandText = "PR_MOM_MeetingVenue_UpdateByPK";
                cmd.Parameters.AddWithValue("@MeetingVenueID", model.MeetingVenueID);
            }
            else
            {
                cmd.CommandText = "PR_MOM_MeetingVenue_Insert";
                var insertUserIdStr = HttpContext.Session.GetString("UserID");
                cmd.Parameters.AddWithValue("@UserID",
                    string.IsNullOrEmpty(insertUserIdStr) ? (object)DBNull.Value : Convert.ToInt32(insertUserIdStr));
            }

            cmd.Parameters.AddWithValue("@MeetingVenueName", model.MeetingVenueName);

            con.Open();
            cmd.ExecuteNonQuery();

            TempData["SuccessMessage"] =
                model.MeetingVenueID == 0
                    ? "Meeting venue added successfully."
                    : "Meeting venue updated successfully.";

            return RedirectToAction("MeetingVenueList");
        }

        public IActionResult DeleteMeetingVenue(int id)
        {
            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                using SqlCommand cmd = new SqlCommand("PR_MOM_MeetingVenue_DeleteByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingVenueID", id);

                con.Open();
                cmd.ExecuteNonQuery();

                TempData["SuccessMessage"] = "Meeting venue deleted successfully.";
            }
            catch (SqlException)
            {
                TempData["ErrorMessage"] =
                    "This meeting venue cannot be deleted because it is linked with other records.";
            }

            return RedirectToAction("MeetingVenueList");
        }
    }
}