using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MOM_PROJECT.Models;
using System.Data;
using ClosedXML.Excel;

namespace MOM_PROJECT.Controllers
{
    public class AttendanceController : Controller
    {
        private readonly string _connectionString =
            "Server=localhost;Database=MOM_PROJECT;User Id=SA;Password=Aniruddh18;TrustServerCertificate=True;";
        
        [HttpGet]
        public IActionResult AttendanceReport()
        {
            ViewBag.StartDate = DateTime.Today.AddMonths(-3).ToString("yyyy-MM-dd");
            ViewBag.EndDate = DateTime.Today.ToString("yyyy-MM-dd");
            ViewBag.Summary = new AttendanceSummaryModel();

            // Get the logged-in user's ID from session
            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            return View(new List<AttendanceReportModel>());
        }
        
        [HttpPost]
        public IActionResult AttendanceReport(DateTime startDate, DateTime endDate)
        {
            // Get the logged-in user's ID from session
            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            var list = GetAttendanceData(startDate, endDate, userId);

            var summary = new AttendanceSummaryModel
            {
                TotalRecords = list.Count,
                PresentCount = list.Count(x => x.IsPresent),
                UniqueMeetings = list.Select(x => x.MeetingID).Distinct().Count()
            };

            summary.AttendanceRate =
                summary.TotalRecords == 0
                ? 0
                : Math.Round((double)summary.PresentCount / summary.TotalRecords * 100, 1);

            ViewBag.Summary = summary;
            ViewBag.StartDate = startDate.ToString("yyyy-MM-dd");
            ViewBag.EndDate = endDate.ToString("yyyy-MM-dd");

            return View(list);
        }
        
        [HttpPost]
        public IActionResult ExportAttendance(DateTime startDate, DateTime endDate)
        {
            // Get the logged-in user's ID from session
            int? userId = null;
            var userIdStr = HttpContext.Session.GetString("UserID");
            if (!string.IsNullOrEmpty(userIdStr))
                userId = Convert.ToInt32(userIdStr);

            var list = GetAttendanceData(startDate, endDate, userId);

            using var wb = new XLWorkbook();
            var ws = wb.Worksheets.Add("Attendance Report");

            string[] headers =
            {
                "Meeting Date","Meeting Type","Venue","Department",
                "Staff","Email","Status","Remarks"
            };

            for (int i = 0; i < headers.Length; i++)
                ws.Cell(1, i + 1).Value = headers[i];

            int row = 2;
            foreach (var x in list)
            {
                ws.Cell(row, 1).Value = x.MeetingDate.ToString("yyyy-MM-dd HH:mm");
                ws.Cell(row, 2).Value = x.MeetingTypeName;
                ws.Cell(row, 3).Value = x.MeetingVenueName;
                ws.Cell(row, 4).Value = x.DepartmentName;
                ws.Cell(row, 5).Value = x.StaffName;
                ws.Cell(row, 6).Value = x.EmailAddress;
                ws.Cell(row, 7).Value = x.IsPresent ? "Present" : "Absent";
                ws.Cell(row, 8).Value = x.Remarks ?? "-";
                row++;
            }

            ws.Columns().AdjustToContents();

            using var stream = new MemoryStream();
            wb.SaveAs(stream);

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"AttendanceReport_{DateTime.Now:yyyyMMddHHmm}.xlsx"
            );
        }
        private List<AttendanceReportModel> GetAttendanceData(DateTime startDate, DateTime endDate, int? userId = null)
        {
            List<AttendanceReportModel> list = new();

            using SqlConnection con = new(_connectionString);
            using SqlCommand cmd = new("PR_MOM_Attendance_Report", con);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@StartDate", startDate);
            cmd.Parameters.AddWithValue("@EndDate", endDate);
            cmd.Parameters.AddWithValue("@UserID", (object?)userId ?? DBNull.Value);

            con.Open();
            using SqlDataReader r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new AttendanceReportModel
                {
                    MeetingID = Convert.ToInt32(r["MeetingID"]),
                    MeetingDate = Convert.ToDateTime(r["MeetingDate"]),
                    MeetingTypeName = r["MeetingTypeName"].ToString(),
                    MeetingVenueName = r["MeetingVenueName"].ToString(),
                    DepartmentName = r["DepartmentName"].ToString(),
                    StaffName = r["StaffName"].ToString(),
                    EmailAddress = r["EmailAddress"].ToString(),
                    IsPresent = Convert.ToBoolean(r["IsPresent"]),
                    Remarks = r["Remarks"]?.ToString()
                });
            }

            return list;
        }
    }
}