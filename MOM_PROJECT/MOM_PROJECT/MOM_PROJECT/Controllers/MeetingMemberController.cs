using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MOM_PROJECT.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Data;

namespace MOM_PROJECT.Controllers
{
    public class MeetingMemberController : Controller
    {
        private readonly string _connectionString =
            "Server=localhost;Database=MOM_PROJECT;User Id=SA;Password=Aniruddh18;TrustServerCertificate=True;";
        
        public IActionResult MeetingMemberList(int meetingId)
        {
            List<MeetingMemberModel> list = new();

            using SqlConnection con = new(_connectionString);
            using SqlCommand cmd = new("PR_MOM_MeetingMember_SelectByMeetingID", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MeetingID", meetingId);

            con.Open();
            SqlDataReader dr = cmd.ExecuteReader();
            while (dr.Read())
            {
                list.Add(new MeetingMemberModel
                {
                    MeetingMemberID = (int)dr["MeetingMemberID"],
                    MeetingID = (int)dr["MeetingID"],
                    StaffName = dr["StaffName"].ToString(),
                    DepartmentName = dr["DepartmentName"].ToString(),
                    IsPresent = (bool)dr["IsPresent"],
                    Remarks = dr["Remarks"]?.ToString()
                });
            }

            ViewBag.MeetingID = meetingId;
            return View(list);
        }
        
        public IActionResult MeetingMemberAddEdit(int meetingId, int id = 0)
        {
            MeetingMemberModel model = new()
            {
                MeetingID = meetingId,
                MeetingList = GetMeetingList(),
                StaffList = GetStaffList()
            };

            if (id > 0)
            {
                using SqlConnection con = new(_connectionString);
                using SqlCommand cmd = new("PR_MOM_MeetingMember_SelectByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingMemberID", id);

                con.Open();
                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    model.MeetingMemberID = id;
                    model.MeetingID = (int)dr["MeetingID"];
                    model.StaffID = (int)dr["StaffID"];
                    model.IsPresent = (bool)dr["IsPresent"];
                    model.Remarks = dr["Remarks"]?.ToString();
                }
            }
            return View(model);
        }

        [HttpPost]
        public IActionResult MeetingMemberSave(MeetingMemberModel model)
        {
            using SqlConnection con = new(_connectionString);
            using SqlCommand cmd = new();
            cmd.Connection = con;
            cmd.CommandType = CommandType.StoredProcedure;

            if (model.MeetingMemberID > 0)
            {
                cmd.CommandText = "PR_MOM_MeetingMember_UpdateByPK";
                cmd.Parameters.AddWithValue("@MeetingMemberID", model.MeetingMemberID);
                cmd.Parameters.AddWithValue("@IsPresent", model.IsPresent);
                cmd.Parameters.AddWithValue("@Remarks", model.Remarks);
            }
            else
            {
                cmd.CommandText = "PR_MOM_MeetingMember_Insert";
                cmd.Parameters.AddWithValue("@MeetingID", model.MeetingID);
                cmd.Parameters.AddWithValue("@StaffID", model.StaffID);
                cmd.Parameters.AddWithValue("@IsPresent", model.IsPresent);
                cmd.Parameters.AddWithValue("@Remarks", model.Remarks);
            }

            con.Open();
            cmd.ExecuteNonQuery();

            return RedirectToAction("MeetingMemberList", new { meetingId = model.MeetingID });
        }

        public IActionResult DeleteMeetingMember(int id, int meetingId)
        {
            using SqlConnection con = new(_connectionString);
            using SqlCommand cmd = new("PR_MOM_MeetingMember_DeleteByPK", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@MeetingMemberID", id);

            con.Open();
            cmd.ExecuteNonQuery();

            return RedirectToAction("MeetingMemberList", new { meetingId });
        }
        
        private List<SelectListItem> GetMeetingList()
        {
            List<SelectListItem> list = new();

            // Filter meetings by the logged-in user
            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            using SqlConnection con = new(_connectionString);
            using SqlCommand cmd = new("PR_MOM_Meetings_SelectAll", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
            con.Open();

            SqlDataReader dr = cmd.ExecuteReader();
            while (dr.Read())
            {
                list.Add(new SelectListItem
                {
                    Value = dr["MeetingID"].ToString(),
                    Text = dr["MeetingDescription"].ToString()
                });
            }
            return list;
        }

        private List<SelectListItem> GetStaffList()
        {
            List<SelectListItem> list = new();

            // Filter staff by the logged-in user
            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            using SqlConnection con = new(_connectionString);
            using SqlCommand cmd = new("PR_MOM_Staff_SelectAll", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
            con.Open();

            SqlDataReader dr = cmd.ExecuteReader();
            while (dr.Read())
            {
                list.Add(new SelectListItem
                {
                    Value = dr["StaffID"].ToString(),
                    Text = dr["StaffName"].ToString()
                });
            }
            return list;
        }
    }
}