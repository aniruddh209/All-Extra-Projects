using Microsoft.AspNetCore.Mvc;
using MOM_PROJECT.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace MOM_PROJECT.Controllers
{
    public class MeetingController : Controller
    {
        private readonly string _connectionString =
            "Server=localhost;Database=MOM_PROJECT;User Id=SA;Password=Aniruddh18;TrustServerCertificate=True;";

        // GET: MeetingList (no search)
        [HttpGet]
        public IActionResult MeetingList()
        {
            List<MeetingModel> list = GetMeetings(null);
            return View(list);
        }

        // POST: MeetingList (search via FormCollection)
        [HttpPost]
        public IActionResult MeetingList(IFormCollection formData)
        {
            string searchText = formData["SearchText"].ToString();
            if (string.IsNullOrWhiteSpace(searchText))
                searchText = null;

            ViewBag.SearchText = searchText;
            List<MeetingModel> list = GetMeetings(searchText);
            return View(list);
        }

        // Shared helper
        private List<MeetingModel> GetMeetings(string? searchText)
        {
            List<MeetingModel> list = new List<MeetingModel>();

            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand("PR_MOM_Meetings_SelectAll", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@SearchText", (object?)searchText ?? DBNull.Value);

                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    MeetingModel model = new MeetingModel();

                    model.MeetingID = Convert.ToInt32(reader["MeetingID"]);
                    model.MeetingDate = reader["MeetingDate"] as DateTime?;
                    model.MeetingDescription = reader["MeetingDescription"]?.ToString();
                    model.DocumentPath = reader["DocumentPath"]?.ToString();

                    if (reader["IsCancelled"] != DBNull.Value)
                        model.IsCancelled = Convert.ToBoolean(reader["IsCancelled"]);

                    model.CancellationDateTime = reader["CancellationDateTime"] as DateTime?;
                    model.CancellationReason = reader["CancellationReason"]?.ToString();

                    list.Add(model);
                }
            }

            return list;
        }

        [HttpGet]
        public IActionResult MeetingAddEdit(int id = 0)
        {
            MeetingModel model = new MeetingModel();

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                con.Open();

                if (id > 0)
                {
                    SqlCommand cmd = new SqlCommand("PR_MOM_Meetings_SelectByPK", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@MeetingID", id);

                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.Read())
                    {
                        model.MeetingID = id;
                        model.MeetingDate = reader["MeetingDate"] as DateTime?;
                        model.DepartmentID = Convert.ToInt32(reader["DepartmentID"]);
                        model.MeetingTypeID = Convert.ToInt32(reader["MeetingTypeID"]);
                        model.MeetingVenueID = Convert.ToInt32(reader["MeetingVenueID"]);
                        model.MeetingDescription = reader["MeetingDescription"]?.ToString();
                        model.DocumentPath = reader["DocumentPath"]?.ToString();
                        model.IsCancelled = Convert.ToBoolean(reader["IsCancelled"]);
                        model.CancellationDateTime = reader["CancellationDateTime"] as DateTime?;
                        model.CancellationReason = reader["CancellationReason"]?.ToString();
                    }

                    reader.Close();
                }
                model.DepartmentList = new List<SelectListItem>();

                // Get the logged-in user's ID for dropdown filtering
                var userIdStr = HttpContext.Session.GetString("UserID");
                object userIdParam = string.IsNullOrEmpty(userIdStr) ? DBNull.Value : (object)Convert.ToInt32(userIdStr);

                SqlCommand deptCmd = new SqlCommand("PR_MOM_Department_SelectAll", con);
                deptCmd.CommandType = CommandType.StoredProcedure;
                deptCmd.Parameters.AddWithValue("@UserID", userIdParam);

                SqlDataReader deptReader = deptCmd.ExecuteReader();

                while (deptReader.Read())
                {
                    model.DepartmentList.Add(new SelectListItem
                    {
                        Value = deptReader["DepartmentID"].ToString(),
                        Text = deptReader["DepartmentName"].ToString()
                    });
                }

                deptReader.Close();

                model.MeetingTypeList = new List<SelectListItem>();
                SqlCommand typeCmd = new SqlCommand("PR_MOM_MeetingType_SelectAll", con);
                typeCmd.CommandType = CommandType.StoredProcedure;
                typeCmd.Parameters.AddWithValue("@UserID", userIdParam);
                SqlDataReader typeReader = typeCmd.ExecuteReader();

                while (typeReader.Read())
                {
                    model.MeetingTypeList.Add(new SelectListItem
                    {
                        Value = typeReader["MeetingTypeID"].ToString(),
                        Text = typeReader["MeetingTypeName"].ToString()
                    });
                }
                typeReader.Close();

                model.MeetingVenueList = new List<SelectListItem>();
                SqlCommand venueCmd = new SqlCommand("PR_MOM_MeetingVenue_SelectAll", con);
                venueCmd.CommandType = CommandType.StoredProcedure;
                venueCmd.Parameters.AddWithValue("@UserID", userIdParam);
                SqlDataReader venueReader = venueCmd.ExecuteReader();

                while (venueReader.Read())
                {
                    model.MeetingVenueList.Add(new SelectListItem
                    {
                        Value = venueReader["MeetingVenueID"].ToString(),
                        Text = venueReader["MeetingVenueName"].ToString()
                    });
                }
                venueReader.Close();
            }

            return View(model);
        }

        [HttpPost]
        public IActionResult MeetingAddEdit(MeetingModel model)
        {
            if (!ModelState.IsValid)
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();

                    // Get the logged-in user's ID for dropdown filtering
                    var postUserIdStr = HttpContext.Session.GetString("UserID");
                    object postUserIdParam = string.IsNullOrEmpty(postUserIdStr) ? DBNull.Value : (object)Convert.ToInt32(postUserIdStr);

                    model.DepartmentList = new List<SelectListItem>();
                    SqlCommand deptCmd = new SqlCommand("PR_MOM_Department_SelectAll", con);
                    deptCmd.CommandType = CommandType.StoredProcedure;
                    deptCmd.Parameters.AddWithValue("@UserID", postUserIdParam);
                    SqlDataReader deptReader = deptCmd.ExecuteReader();
                    while (deptReader.Read())
                    {
                        model.DepartmentList.Add(new SelectListItem
                        {
                            Value = deptReader["DepartmentID"].ToString(),
                            Text = deptReader["DepartmentName"].ToString()
                        });
                    }
                    deptReader.Close();

                    model.MeetingTypeList = new List<SelectListItem>();
                    SqlCommand typeCmd = new SqlCommand("PR_MOM_MeetingType_SelectAll", con);
                    typeCmd.CommandType = CommandType.StoredProcedure;
                    typeCmd.Parameters.AddWithValue("@UserID", postUserIdParam);
                    SqlDataReader typeReader = typeCmd.ExecuteReader();
                    while (typeReader.Read())
                    {
                        model.MeetingTypeList.Add(new SelectListItem
                        {
                            Value = typeReader["MeetingTypeID"].ToString(),
                            Text = typeReader["MeetingTypeName"].ToString()
                        });
                    }
                    typeReader.Close();

                    model.MeetingVenueList = new List<SelectListItem>();
                    SqlCommand venueCmd = new SqlCommand("PR_MOM_MeetingVenue_SelectAll", con);
                    venueCmd.CommandType = CommandType.StoredProcedure;
                    venueCmd.Parameters.AddWithValue("@UserID", postUserIdParam);
                    SqlDataReader venueReader = venueCmd.ExecuteReader();
                    while (venueReader.Read())
                    {
                        model.MeetingVenueList.Add(new SelectListItem
                        {
                            Value = venueReader["MeetingVenueID"].ToString(),
                            Text = venueReader["MeetingVenueName"].ToString()
                        });
                    }
                    venueReader.Close();
                }
                return View("MeetingAddEdit", model);
            }

            using (SqlConnection con = new SqlConnection(_connectionString))
            {
                SqlCommand cmd = new SqlCommand();
                cmd.Connection = con;
                cmd.CommandType = CommandType.StoredProcedure;

                if (model.MeetingID > 0)
                {
                    cmd.CommandText = "PR_MOM_Meetings_UpdateByPK";
                    cmd.Parameters.AddWithValue("@MeetingID", model.MeetingID);
                    cmd.Parameters.AddWithValue("@IsCancelled", model.IsCancelled);
                    cmd.Parameters.AddWithValue("@CancellationDateTime",
                        model.CancellationDateTime ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@CancellationReason",
                        model.CancellationReason ?? (object)DBNull.Value);
                }
                else
                {
                    cmd.CommandText = "PR_MOM_Meetings_Insert";

                    // Save the logged-in user's ID with the meeting
                    var userIdStr = HttpContext.Session.GetString("UserID");
                    if (!string.IsNullOrEmpty(userIdStr))
                        cmd.Parameters.AddWithValue("@UserID", Convert.ToInt32(userIdStr));
                    else
                        cmd.Parameters.AddWithValue("@UserID", DBNull.Value);
                }

                cmd.Parameters.AddWithValue("@MeetingDate", model.MeetingDate);
                cmd.Parameters.AddWithValue("@MeetingVenueID", model.MeetingVenueID);
                cmd.Parameters.AddWithValue("@MeetingTypeID", model.MeetingTypeID);
                cmd.Parameters.AddWithValue("@DepartmentID", model.DepartmentID);
                cmd.Parameters.AddWithValue("@MeetingDescription", model.MeetingDescription);
                cmd.Parameters.AddWithValue("@DocumentPath",
                    model.DocumentPath ?? (object)DBNull.Value);

                con.Open();
                cmd.ExecuteNonQuery();
            }

            TempData["SuccessMessage"] =
                model.MeetingID == 0
                    ? "Meeting added successfully."
                    : "Meeting updated successfully.";

            return RedirectToAction("MeetingList");
        }

        public IActionResult DeleteMeeting(int id)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(_connectionString))
                {
                    con.Open();

                    // Delete associated meeting members first to avoid FK constraints
                    SqlCommand deleteMembersCmd = new SqlCommand("DELETE FROM MOM_MeetingMember WHERE MeetingID = @MeetingID", con);
                    deleteMembersCmd.Parameters.AddWithValue("@MeetingID", id);
                    deleteMembersCmd.ExecuteNonQuery();

                    // Now delete the meeting itself
                    SqlCommand cmd = new SqlCommand("PR_MOM_Meetings_DeleteByPK", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@MeetingID", id);

                    cmd.ExecuteNonQuery();
                }

                TempData["SuccessMessage"] = "Meeting and its members deleted successfully.";
            }
            catch (SqlException)
            {
                TempData["ErrorMessage"] =
                    "This meeting cannot be deleted because it is linked with other records.";
            }

            return RedirectToAction("MeetingList");
        }
    }
}