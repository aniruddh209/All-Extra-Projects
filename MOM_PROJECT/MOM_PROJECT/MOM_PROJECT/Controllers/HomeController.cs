using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;
using ClosedXML.Excel;

namespace MOM_PROJECT.Controllers
{
    public class HomeController : Controller
    {
        private readonly string _connectionString =
            "Server=localhost;Database=MOM_PROJECT;User Id=SA;Password=Aniruddh18;TrustServerCertificate=True;";

        public IActionResult Index()
        {
            int totalMeetings   = 0;
            int cancelled       = 0;
            int totalMembers    = 0;
            int totalDepts      = 0;

            List<string> typeLabels = new List<string>();
            List<int> typeData = new List<int>();
            List<string> deptLabels = new List<string>();
            List<int> deptData = new List<int>();

            // Get the logged-in user's ID from session
            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            try
            {
                using SqlConnection con = new SqlConnection(_connectionString);
                con.Open();

                string userFilter = userId.HasValue ? " WHERE UserID = @UserID" : "";

                // Total meetings
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM MOM_Meetings" + userFilter, con))
                {
                    if (userId.HasValue) cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    totalMeetings = (int)cmd.ExecuteScalar();
                }

                // Cancelled meetings
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM MOM_Meetings WHERE IsCancelled = 1" +
                    (userId.HasValue ? " AND UserID = @UserID" : ""), con))
                {
                    if (userId.HasValue) cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    cancelled = (int)cmd.ExecuteScalar();
                }

                // Total meeting members
                using (SqlCommand cmd = new SqlCommand(
                    "SELECT COUNT(*) FROM MOM_MeetingMember MM" +
                    (userId.HasValue ? " INNER JOIN MOM_Meetings M ON MM.MeetingID = M.MeetingID WHERE M.UserID = @UserID" : ""), con))
                {
                    if (userId.HasValue) cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    totalMembers = (int)cmd.ExecuteScalar();
                }

                // Total departments
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM MOM_Department" + userFilter, con))
                {
                    if (userId.HasValue) cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    totalDepts = (int)cmd.ExecuteScalar();
                }

                // Meetings by Type
                string typeQry = @"
                    SELECT t.MeetingTypeName, COUNT(m.MeetingID) 
                    FROM MOM_MeetingType t 
                    LEFT JOIN MOM_Meetings m ON t.MeetingTypeID = m.MeetingTypeID" +
                    (userId.HasValue ? " AND m.UserID = @UserID" : "") +
                    (userId.HasValue ? " WHERE t.UserID = @UserID2" : "") + @"
                    GROUP BY t.MeetingTypeName";
                using (SqlCommand cmd = new SqlCommand(typeQry, con))
                {
                    if (userId.HasValue)
                    {
                        cmd.Parameters.AddWithValue("@UserID", userId.Value);
                        cmd.Parameters.AddWithValue("@UserID2", userId.Value);
                    }
                    using SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        typeLabels.Add(dr.GetString(0));
                        typeData.Add(dr.IsDBNull(1) ? 0 : dr.GetInt32(1));
                    }
                }

                // Meetings by Department
                string deptQry = @"
                    SELECT d.DepartmentName, COUNT(m.MeetingID) 
                    FROM MOM_Department d 
                    LEFT JOIN MOM_Meetings m ON d.DepartmentID = m.DepartmentID" +
                    (userId.HasValue ? " AND m.UserID = @UserID" : "") +
                    (userId.HasValue ? " WHERE d.UserID = @UserID2" : "") + @"
                    GROUP BY d.DepartmentName";
                using (SqlCommand cmd = new SqlCommand(deptQry, con))
                {
                    if (userId.HasValue)
                    {
                        cmd.Parameters.AddWithValue("@UserID", userId.Value);
                        cmd.Parameters.AddWithValue("@UserID2", userId.Value);
                    }
                    using SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {
                        deptLabels.Add(dr.GetString(0));
                        deptData.Add(dr.IsDBNull(1) ? 0 : dr.GetInt32(1));
                    }
                }
            }
            catch
            {
                // If DB is down, fall back to zeros — no crash
            }

            int completed = totalMeetings - cancelled;

            ViewBag.TotalMeetings    = totalMeetings;
            ViewBag.CancelledMeetings = cancelled;
            ViewBag.CompletedMeetings = completed;
            ViewBag.TotalMembers      = totalMembers;
            ViewBag.TotalDepts        = totalDepts;

            ViewBag.TypeLabels = typeLabels.ToArray();
            ViewBag.TypeData = typeData.ToArray();
            ViewBag.DeptLabels = deptLabels.ToArray();
            ViewBag.DeptData = deptData.ToArray();

            return View();
        }

        // =============================================
        //   EXPORT DASHBOARD REPORT TO EXCEL
        // =============================================
        public IActionResult ExportDashboardReport()
        {
            try
            {
                int? userId = null;
                var userIdStr = HttpContext.Session.GetString("UserID");
                if (!string.IsNullOrEmpty(userIdStr))
                    userId = Convert.ToInt32(userIdStr);

                string userFilter = userId.HasValue ? " WHERE UserID = @UserID" : "";

                using SqlConnection con = new SqlConnection(_connectionString);
                con.Open();

                using var workbook = new XLWorkbook();

                // ── Sheet 1: Summary ──────────────────
                var wsSummary = workbook.Worksheets.Add("Dashboard Summary");

                int totalMeetings = 0, cancelled = 0, completed = 0, totalMembers = 0, totalDepts = 0, totalStaff = 0;

                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM MOM_Meetings" + userFilter, con))
                {
                    if (userId.HasValue) cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    totalMeetings = (int)cmd.ExecuteScalar();
                }
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM MOM_Meetings WHERE IsCancelled = 1" +
                    (userId.HasValue ? " AND UserID = @UserID" : ""), con))
                {
                    if (userId.HasValue) cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    cancelled = (int)cmd.ExecuteScalar();
                }
                completed = totalMeetings - cancelled;
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM MOM_MeetingMember MM" +
                    (userId.HasValue ? " INNER JOIN MOM_Meetings M ON MM.MeetingID = M.MeetingID WHERE M.UserID = @UserID" : ""), con))
                {
                    if (userId.HasValue) cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    totalMembers = (int)cmd.ExecuteScalar();
                }
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM MOM_Department" + userFilter, con))
                {
                    if (userId.HasValue) cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    totalDepts = (int)cmd.ExecuteScalar();
                }
                using (SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM MOM_Staff" + userFilter, con))
                {
                    if (userId.HasValue) cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    totalStaff = (int)cmd.ExecuteScalar();
                }

                // Summary headers
                wsSummary.Cell(1, 1).Value = "MOM PROJECT - Dashboard Report";
                wsSummary.Cell(1, 1).Style.Font.Bold = true;
                wsSummary.Cell(1, 1).Style.Font.FontSize = 16;
                wsSummary.Cell(2, 1).Value = "Generated on: " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                wsSummary.Cell(4, 1).Value = "Metric";
                wsSummary.Cell(4, 2).Value = "Value";
                wsSummary.Range("A4:B4").Style.Font.Bold = true;
                wsSummary.Range("A4:B4").Style.Fill.BackgroundColor = XLColor.FromHtml("#6366f1");
                wsSummary.Range("A4:B4").Style.Font.FontColor = XLColor.White;

                wsSummary.Cell(5, 1).Value = "Total Meetings";
                wsSummary.Cell(5, 2).Value = totalMeetings;
                wsSummary.Cell(6, 1).Value = "Completed / Upcoming";
                wsSummary.Cell(6, 2).Value = completed;
                wsSummary.Cell(7, 1).Value = "Cancelled Meetings";
                wsSummary.Cell(7, 2).Value = cancelled;
                wsSummary.Cell(8, 1).Value = "Total Attendees Logged";
                wsSummary.Cell(8, 2).Value = totalMembers;
                wsSummary.Cell(9, 1).Value = "Total Departments";
                wsSummary.Cell(9, 2).Value = totalDepts;
                wsSummary.Cell(10, 1).Value = "Total Staff";
                wsSummary.Cell(10, 2).Value = totalStaff;

                wsSummary.Columns().AdjustToContents();

                // ── Sheet 2: Meetings ─────────────────
                DataTable dtMeetings = new DataTable();
                using (SqlCommand cmd = new SqlCommand("PR_MOM_Meetings_SelectAll", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
                    using SqlDataReader dr = cmd.ExecuteReader();
                    dtMeetings.Load(dr);
                }
                var wsMeetings = workbook.Worksheets.Add("Meetings");
                for (int i = 0; i < dtMeetings.Columns.Count; i++)
                {
                    wsMeetings.Cell(1, i + 1).Value = dtMeetings.Columns[i].ColumnName;
                    wsMeetings.Cell(1, i + 1).Style.Font.Bold = true;
                    wsMeetings.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#6366f1");
                    wsMeetings.Cell(1, i + 1).Style.Font.FontColor = XLColor.White;
                }
                for (int row = 0; row < dtMeetings.Rows.Count; row++)
                {
                    for (int col = 0; col < dtMeetings.Columns.Count; col++)
                    {
                        wsMeetings.Cell(row + 2, col + 1).Value = dtMeetings.Rows[row][col]?.ToString();
                    }
                }
                wsMeetings.Columns().AdjustToContents();

                // ── Sheet 3: Departments ──────────────
                DataTable dtDepts = new DataTable();
                using (SqlCommand cmd = new SqlCommand("PR_MOM_Department_SelectAll", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
                    using SqlDataReader dr = cmd.ExecuteReader();
                    dtDepts.Load(dr);
                }
                var wsDepts = workbook.Worksheets.Add("Departments");
                for (int i = 0; i < dtDepts.Columns.Count; i++)
                {
                    wsDepts.Cell(1, i + 1).Value = dtDepts.Columns[i].ColumnName;
                    wsDepts.Cell(1, i + 1).Style.Font.Bold = true;
                    wsDepts.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#10b981");
                    wsDepts.Cell(1, i + 1).Style.Font.FontColor = XLColor.White;
                }
                for (int row = 0; row < dtDepts.Rows.Count; row++)
                {
                    for (int col = 0; col < dtDepts.Columns.Count; col++)
                    {
                        wsDepts.Cell(row + 2, col + 1).Value = dtDepts.Rows[row][col]?.ToString();
                    }
                }
                wsDepts.Columns().AdjustToContents();

                // ── Sheet 4: Staff ────────────────────
                DataTable dtStaff = new DataTable();
                using (SqlCommand cmd = new SqlCommand("PR_MOM_Staff_SelectAll", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
                    using SqlDataReader dr = cmd.ExecuteReader();
                    dtStaff.Load(dr);
                }
                var wsStaff = workbook.Worksheets.Add("Staff");
                for (int i = 0; i < dtStaff.Columns.Count; i++)
                {
                    wsStaff.Cell(1, i + 1).Value = dtStaff.Columns[i].ColumnName;
                    wsStaff.Cell(1, i + 1).Style.Font.Bold = true;
                    wsStaff.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#f59e0b");
                    wsStaff.Cell(1, i + 1).Style.Font.FontColor = XLColor.White;
                }
                for (int row = 0; row < dtStaff.Rows.Count; row++)
                {
                    for (int col = 0; col < dtStaff.Columns.Count; col++)
                    {
                        wsStaff.Cell(row + 2, col + 1).Value = dtStaff.Rows[row][col]?.ToString();
                    }
                }
                wsStaff.Columns().AdjustToContents();

                // ── Sheet 5: Meeting Types ────────────
                DataTable dtTypes = new DataTable();
                using (SqlCommand cmd = new SqlCommand("PR_MOM_MeetingType_SelectAll", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
                    using SqlDataReader dr = cmd.ExecuteReader();
                    dtTypes.Load(dr);
                }
                var wsTypes = workbook.Worksheets.Add("Meeting Types");
                for (int i = 0; i < dtTypes.Columns.Count; i++)
                {
                    wsTypes.Cell(1, i + 1).Value = dtTypes.Columns[i].ColumnName;
                    wsTypes.Cell(1, i + 1).Style.Font.Bold = true;
                    wsTypes.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#3b82f6");
                    wsTypes.Cell(1, i + 1).Style.Font.FontColor = XLColor.White;
                }
                for (int row = 0; row < dtTypes.Rows.Count; row++)
                {
                    for (int col = 0; col < dtTypes.Columns.Count; col++)
                    {
                        wsTypes.Cell(row + 2, col + 1).Value = dtTypes.Rows[row][col]?.ToString();
                    }
                }
                wsTypes.Columns().AdjustToContents();

                // ── Sheet 6: Meeting Venues ───────────
                DataTable dtVenues = new DataTable();
                using (SqlCommand cmd = new SqlCommand("PR_MOM_MeetingVenue_SelectAll", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);
                    using SqlDataReader dr = cmd.ExecuteReader();
                    dtVenues.Load(dr);
                }
                var wsVenues = workbook.Worksheets.Add("Meeting Venues");
                for (int i = 0; i < dtVenues.Columns.Count; i++)
                {
                    wsVenues.Cell(1, i + 1).Value = dtVenues.Columns[i].ColumnName;
                    wsVenues.Cell(1, i + 1).Style.Font.Bold = true;
                    wsVenues.Cell(1, i + 1).Style.Fill.BackgroundColor = XLColor.FromHtml("#8b5cf6");
                    wsVenues.Cell(1, i + 1).Style.Font.FontColor = XLColor.White;
                }
                for (int row = 0; row < dtVenues.Rows.Count; row++)
                {
                    for (int col = 0; col < dtVenues.Columns.Count; col++)
                    {
                        wsVenues.Cell(row + 2, col + 1).Value = dtVenues.Rows[row][col]?.ToString();
                    }
                }
                wsVenues.Columns().AdjustToContents();

                // Save and return
                using var stream = new MemoryStream();
                workbook.SaveAs(stream);

                return File(
                    stream.ToArray(),
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"MOM_DashboardReport_{DateTime.Now:yyyyMMddHHmm}.xlsx"
                );
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Error exporting report: " + ex.Message;
                return RedirectToAction("Index");
            }
        }
    }
}