using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Data.SqlClient;
using MOM_PROJECT.Filters;
using MOM_PROJECT.Models;
using System.Data;

namespace MOM_PROJECT.Controllers
{
    public class AdminController : Controller
    {
        private readonly string _connectionString =
            "Server=localhost;Database=MOM_PROJECT;User Id=SA;Password=Aniruddh18;TrustServerCertificate=True;";

        // =============================================
        //  ADMIN LOGIN  (unified with main Login page)
        // =============================================

        [AllowAnonymous]
        [HttpGet]
        public IActionResult AdminLogin()
        {
            if (HttpContext.Session.GetString("AdminID") != null)
                return RedirectToAction("AdminDashboard");
            // Redirect to unified login page
            return RedirectToAction("Login", "Account");
        }

        [AllowAnonymous]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AdminLogin(UserModel model)
        {
            if (!ModelState.IsValid)
            {
                ViewData["LoginRole"] = "Admin";
                return View("~/Views/Account/Login.cshtml", model);
            }

            try
            {
                using SqlConnection con = new(_connectionString);
                using SqlCommand cmd = con.CreateCommand();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.CommandText = "PR_MST_User_Login";
                cmd.Parameters.AddWithValue("@Username", model.Username);
                cmd.Parameters.AddWithValue("@Password", model.Password);

                con.Open();
                using SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    string role = reader["Role"].ToString() ?? "";

                    if (!string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase))
                    {
                        ModelState.AddModelError(string.Empty, "❌ Access denied. This login is for Administrators only. Please select Member Login instead.");
                        ViewData["LoginRole"] = "Admin";
                        return View("~/Views/Account/Login.cshtml", model);
                    }

                    string uid   = reader["UserID"].ToString()!;
                    string uname = reader["Username"].ToString()!;

                    HttpContext.Session.SetString("AdminID",      uid);
                    HttpContext.Session.SetString("AdminName",    uname);
                    HttpContext.Session.SetString("AdminRole",    role);
                    HttpContext.Session.SetString("UserID",       uid);
                    HttpContext.Session.SetString("UserName",     uname);
                    HttpContext.Session.SetString("UserRole",     role);
                    HttpContext.Session.SetString("ProfilePhoto", reader["ProfilePhoto"]?.ToString() ?? "");

                    return RedirectToAction("AdminDashboard");
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "❌ Incorrect username or password.");
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError(string.Empty, "Something went wrong: " + ex.Message);
            }

            ViewData["LoginRole"] = "Admin";
            return View("~/Views/Account/Login.cshtml", model);
        }

        [AdminOnly]
        public IActionResult AdminLogout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "Account");
        }

        [AllowAnonymous]
        public IActionResult AccessDenied() => View();

        // =============================================
        //  ADMIN DASHBOARD — User-centric
        // =============================================

        [AdminOnly]
        public IActionResult AdminDashboard()
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                con.Open();

                ViewBag.TotalUsers    = ScalarInt(con, "SELECT COUNT(*) FROM MOM_User WHERE Role != 'Admin'");
                ViewBag.TotalMeetings = ScalarInt(con, "SELECT COUNT(*) FROM MOM_Meetings");
                ViewBag.Cancelled     = ScalarInt(con, "SELECT COUNT(*) FROM MOM_Meetings WHERE IsCancelled = 1");
                ViewBag.TotalStaff    = ScalarInt(con, "SELECT COUNT(*) FROM MOM_Staff");
                ViewBag.TotalDepts    = ScalarInt(con, "SELECT COUNT(*) FROM MOM_Department");
                ViewBag.TotalTypes    = ScalarInt(con, "SELECT COUNT(*) FROM MOM_MeetingType");
                ViewBag.TotalVenues   = ScalarInt(con, "SELECT COUNT(*) FROM MOM_MeetingVenue");
                ViewBag.TotalMembers  = ScalarInt(con, "SELECT COUNT(*) FROM MOM_MeetingMember");

                // All users (excluding admin) with their data counts
                using (var cmd = new SqlCommand(@"
                    SELECT U.UserID, U.Username, U.Role, U.Created, U.Modified,
                           (SELECT COUNT(*) FROM MOM_Meetings     WHERE UserID = U.UserID) AS MeetingCount,
                           (SELECT COUNT(*) FROM MOM_Staff        WHERE UserID = U.UserID) AS StaffCount,
                           (SELECT COUNT(*) FROM MOM_Department   WHERE UserID = U.UserID) AS DeptCount,
                           (SELECT COUNT(*) FROM MOM_MeetingType  WHERE UserID = U.UserID) AS TypeCount,
                           (SELECT COUNT(*) FROM MOM_MeetingVenue WHERE UserID = U.UserID) AS VenueCount
                    FROM MOM_User U
                    WHERE U.Role != 'Admin'
                    ORDER BY U.Created DESC", con))
                {
                    var list = new List<Dictionary<string, object>>();
                    using var dr = cmd.ExecuteReader();
                    while (dr.Read())
                        list.Add(new() {
                            ["UserID"]       = dr["UserID"],
                            ["Username"]     = dr["Username"],
                            ["Role"]         = dr["Role"],
                            ["Created"]      = dr["Created"],
                            ["Modified"]     = dr["Modified"],
                            ["MeetingCount"] = dr["MeetingCount"],
                            ["StaffCount"]   = dr["StaffCount"],
                            ["DeptCount"]    = dr["DeptCount"],
                            ["TypeCount"]    = dr["TypeCount"],
                            ["VenueCount"]   = dr["VenueCount"]
                        });
                    ViewBag.AllUsers = list;
                }
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Dashboard error: " + ex.Message;
            }

            return View();
        }

        // =============================================
        //  USER DETAIL PAGE — All data for one user
        // =============================================

        [AdminOnly]
        [HttpGet]
        public IActionResult UserDetail(int id, string? tab)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                con.Open();

                // User Info
                var userInfo = new Dictionary<string, object>();
                using (var cmd = new SqlCommand("SELECT UserID, Username, Role, Created, Modified FROM MOM_User WHERE UserID = @ID", con))
                {
                    cmd.Parameters.AddWithValue("@ID", id);
                    using var dr = cmd.ExecuteReader();
                    if (dr.Read())
                    {
                        userInfo["UserID"]   = dr["UserID"];
                        userInfo["Username"] = dr["Username"];
                        userInfo["Role"]     = dr["Role"];
                        userInfo["Created"]  = dr["Created"];
                        userInfo["Modified"] = dr["Modified"];
                    }
                    else
                    {
                        TempData["ErrorMessage"] = "User not found.";
                        return RedirectToAction("AdminDashboard");
                    }
                }
                ViewBag.UserInfo = userInfo;

                // Meetings for this user
                using (var cmd = new SqlCommand(@"
                    SELECT M.MeetingID, M.MeetingDate, M.MeetingDescription,
                           V.MeetingVenueName, T.MeetingTypeName, D.DepartmentName,
                           M.IsCancelled, M.CancellationReason, M.DocumentPath
                    FROM MOM_Meetings M
                    INNER JOIN MOM_MeetingVenue V ON M.MeetingVenueID = V.MeetingVenueID
                    INNER JOIN MOM_MeetingType  T ON M.MeetingTypeID  = T.MeetingTypeID
                    INNER JOIN MOM_Department   D ON M.DepartmentID   = D.DepartmentID
                    WHERE M.UserID = @ID
                    ORDER BY M.MeetingDate DESC", con))
                {
                    cmd.Parameters.AddWithValue("@ID", id);
                    var list = new List<Dictionary<string, object>>();
                    using var dr = cmd.ExecuteReader();
                    while (dr.Read())
                        list.Add(new() {
                            ["MeetingID"]          = dr["MeetingID"],
                            ["MeetingDate"]        = dr["MeetingDate"],
                            ["MeetingDescription"] = dr["MeetingDescription"],
                            ["MeetingVenueName"]   = dr["MeetingVenueName"],
                            ["MeetingTypeName"]    = dr["MeetingTypeName"],
                            ["DepartmentName"]     = dr["DepartmentName"],
                            ["IsCancelled"]        = dr["IsCancelled"],
                            ["CancellationReason"] = dr["CancellationReason"],
                            ["DocumentPath"]       = dr["DocumentPath"]
                        });
                    ViewBag.UserMeetings = list;
                }

                // Staff for this user
                using (var cmd = new SqlCommand(@"
                    SELECT S.StaffID, S.StaffName, S.MobileNo, S.EmailAddress,
                           D.DepartmentName, S.Remarks
                    FROM MOM_Staff S
                    INNER JOIN MOM_Department D ON S.DepartmentID = D.DepartmentID
                    WHERE S.UserID = @ID
                    ORDER BY S.StaffName", con))
                {
                    cmd.Parameters.AddWithValue("@ID", id);
                    var list = new List<Dictionary<string, object>>();
                    using var dr = cmd.ExecuteReader();
                    while (dr.Read())
                        list.Add(new() {
                            ["StaffID"]        = dr["StaffID"],
                            ["StaffName"]      = dr["StaffName"],
                            ["MobileNo"]       = dr["MobileNo"],
                            ["EmailAddress"]   = dr["EmailAddress"],
                            ["DepartmentName"] = dr["DepartmentName"],
                            ["Remarks"]        = dr["Remarks"]
                        });
                    ViewBag.UserStaff = list;
                }

                // Departments for this user
                using (var cmd = new SqlCommand(@"
                    SELECT D.DepartmentID, D.DepartmentName,
                           (SELECT COUNT(*) FROM MOM_Staff S WHERE S.DepartmentID = D.DepartmentID AND S.UserID = @ID) AS StaffCount
                    FROM MOM_Department D
                    WHERE D.UserID = @ID
                    ORDER BY D.DepartmentName", con))
                {
                    cmd.Parameters.AddWithValue("@ID", id);
                    var list = new List<Dictionary<string, object>>();
                    using var dr = cmd.ExecuteReader();
                    while (dr.Read())
                        list.Add(new() {
                            ["DepartmentID"]   = dr["DepartmentID"],
                            ["DepartmentName"] = dr["DepartmentName"],
                            ["StaffCount"]     = dr["StaffCount"]
                        });
                    ViewBag.UserDepartments = list;
                }

                // Meeting Types for this user
                using (var cmd = new SqlCommand(@"
                    SELECT MT.MeetingTypeID, MT.MeetingTypeName, MT.Remarks
                    FROM MOM_MeetingType MT
                    WHERE MT.UserID = @ID
                    ORDER BY MT.MeetingTypeName", con))
                {
                    cmd.Parameters.AddWithValue("@ID", id);
                    var list = new List<Dictionary<string, object>>();
                    using var dr = cmd.ExecuteReader();
                    while (dr.Read())
                        list.Add(new() {
                            ["MeetingTypeID"]   = dr["MeetingTypeID"],
                            ["MeetingTypeName"] = dr["MeetingTypeName"],
                            ["Remarks"]         = dr["Remarks"]
                        });
                    ViewBag.UserMeetingTypes = list;
                }

                // Meeting Venues for this user
                using (var cmd = new SqlCommand(@"
                    SELECT MV.MeetingVenueID, MV.MeetingVenueName, MV.Created
                    FROM MOM_MeetingVenue MV
                    WHERE MV.UserID = @ID
                    ORDER BY MV.MeetingVenueName", con))
                {
                    cmd.Parameters.AddWithValue("@ID", id);
                    var list = new List<Dictionary<string, object>>();
                    using var dr = cmd.ExecuteReader();
                    while (dr.Read())
                        list.Add(new() {
                            ["MeetingVenueID"]   = dr["MeetingVenueID"],
                            ["MeetingVenueName"] = dr["MeetingVenueName"],
                            ["Created"]          = dr["Created"]
                        });
                    ViewBag.UserMeetingVenues = list;
                }

                ViewBag.ActiveTab = tab ?? "meetings";
                ViewBag.TargetUserID = id;
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Error loading user details: " + ex.Message;
                return RedirectToAction("AdminDashboard");
            }

            return View();
        }

        // =============================================
        //  USER MANAGEMENT  (full CRUD)
        // =============================================

        [AdminOnly]
        [HttpGet]
        public IActionResult UserList(string? search)
        {
            var list = new List<Dictionary<string, object>>();
            try
            {
                using SqlConnection con = new(_connectionString);
                const string sql = @"
                    SELECT UserID, Username, Role, Created, Modified
                    FROM MOM_User
                    WHERE Role != 'Admin'
                      AND (@Search IS NULL OR Username LIKE '%' + @Search + '%')
                    ORDER BY Created DESC";
                using var cmd = new SqlCommand(sql, con);
                cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                con.Open();
                using var dr = cmd.ExecuteReader();
                while (dr.Read())
                    list.Add(new() {
                        ["UserID"]   = dr["UserID"],
                        ["Username"] = dr["Username"],
                        ["Role"]     = dr["Role"],
                        ["Created"]  = dr["Created"],
                        ["Modified"] = dr["Modified"]
                    });
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            ViewBag.SearchText = search;
            return View(list);
        }

        [AdminOnly]
        [HttpGet]
        public IActionResult UserAddEdit(int id = 0)
        {
            var model = new AdminUserModel { UserID = id };
            if (id > 0)
            {
                try
                {
                    using SqlConnection con = new(_connectionString);
                    using var cmd = new SqlCommand(
                        "SELECT UserID, Username, Role FROM MOM_User WHERE UserID = @ID", con);
                    cmd.Parameters.AddWithValue("@ID", id);
                    con.Open();
                    using var dr = cmd.ExecuteReader();
                    if (dr.Read())
                    {
                        model.UserID   = (int)dr["UserID"];
                        model.Username = dr["Username"].ToString()!;
                        model.Role     = dr["Role"].ToString()!;
                    }
                }
                catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }
            }
            return View(model);
        }

        [AdminOnly]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UserAddEdit(AdminUserModel model)
        {
            if (!ModelState.IsValid) return View(model);

            try
            {
                using SqlConnection con = new(_connectionString);
                con.Open();

                if (model.UserID == 0)
                {
                    // Create new user via SP
                    using var cmd = new SqlCommand("PR_MST_User_Register", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Username", model.Username);
                    cmd.Parameters.AddWithValue("@Password", model.Password ?? "changeme");
                    cmd.Parameters.AddWithValue("@Role",     model.Role);
                    cmd.ExecuteReader().Close();
                }
                else
                {
                    // Update username + role
                    using var cmd = new SqlCommand(
                        "UPDATE MOM_User SET Username=@U, Role=@R, Modified=GETDATE() WHERE UserID=@ID", con);
                    cmd.Parameters.AddWithValue("@U",  model.Username);
                    cmd.Parameters.AddWithValue("@R",  model.Role);
                    cmd.Parameters.AddWithValue("@ID", model.UserID);
                    cmd.ExecuteNonQuery();

                    // Update password only if provided
                    if (!string.IsNullOrWhiteSpace(model.Password))
                    {
                        using var pwdCmd = new SqlCommand(
                            "UPDATE MOM_User SET Password=@P WHERE UserID=@ID", con);
                        pwdCmd.Parameters.AddWithValue("@P",  model.Password);
                        pwdCmd.Parameters.AddWithValue("@ID", model.UserID);
                        pwdCmd.ExecuteNonQuery();
                    }
                }

                TempData["SuccessMessage"] = model.UserID == 0
                    ? "User created successfully."
                    : "User updated successfully.";
            }
            catch (SqlException ex) when (ex.Message.Contains("Username already exists"))
            {
                ModelState.AddModelError("Username", "This username is already taken.");
                return View(model);
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = ex.Message;
                return View(model);
            }

            return RedirectToAction("UserList");
        }

        /// <summary>
        /// CASCADE DELETE: removes ALL data belonging to this user before deleting the user account.
        /// Order matters to avoid FK violations.
        /// </summary>
        [AdminOnly]
        public IActionResult DeleteUser(int id)
        {
            // Prevent self-delete
            if (HttpContext.Session.GetString("AdminID") == id.ToString())
            {
                TempData["ErrorMessage"] = "You cannot delete your own admin account.";
                return RedirectToAction("AdminDashboard");
            }

            try
            {
                using SqlConnection con = new(_connectionString);
                con.Open();

                // 1. Delete MeetingMembers that belong to this user's MEETINGS
                ExecSql(con, @"
                    DELETE MM FROM MOM_MeetingMember MM
                    INNER JOIN MOM_Meetings M ON MM.MeetingID = M.MeetingID
                    WHERE M.UserID = @ID", id);

                // 2. Delete MeetingMembers where the STAFF belongs to this user
                //    (they may be in OTHER users' meetings — must remove before deleting staff)
                ExecSql(con, @"
                    DELETE MM FROM MOM_MeetingMember MM
                    INNER JOIN MOM_Staff S ON MM.StaffID = S.StaffID
                    WHERE S.UserID = @ID", id);

                // 3. Delete this user's Meetings
                ExecSql(con, "DELETE FROM MOM_Meetings WHERE UserID = @ID", id);

                // 4. Delete this user's Staff
                ExecSql(con, "DELETE FROM MOM_Staff WHERE UserID = @ID", id);

                // 5. Delete this user's Meeting Venues
                ExecSql(con, "DELETE FROM MOM_MeetingVenue WHERE UserID = @ID", id);

                // 6. Delete this user's Meeting Types
                ExecSql(con, "DELETE FROM MOM_MeetingType WHERE UserID = @ID", id);

                // 7. Delete this user's Departments
                //    (staff deleted in step 4, so FK is clear now)
                ExecSql(con, "DELETE FROM MOM_Department WHERE UserID = @ID", id);

                // 8. Delete the User account itself
                ExecSql(con, "DELETE FROM MOM_User WHERE UserID = @ID", id);

                TempData["SuccessMessage"] = "User and all their data deleted successfully.";
            }
            catch (Exception ex)
            {
                TempData["ErrorMessage"] = "Error deleting user: " + ex.Message;
            }

            return RedirectToAction("AdminDashboard");
        }

        // =============================================
        //  MEETINGS FOR SPECIFIC USER (view + edit + delete)
        // =============================================

        [AdminOnly]
        [HttpGet]
        public IActionResult AllMeetings(string? search, int? userId)
        {
            var list = new List<Dictionary<string, object>>();
            try
            {
                using SqlConnection con = new(_connectionString);
                string sql;
                SqlCommand cmd;

                if (userId.HasValue)
                {
                    sql = @"
                        SELECT M.MeetingID, M.MeetingDate, M.MeetingDescription,
                               V.MeetingVenueName, T.MeetingTypeName, D.DepartmentName,
                               M.IsCancelled, M.CancellationReason,
                               ISNULL(U.Username,'—') AS CreatedBy, M.DocumentPath
                        FROM MOM_Meetings M
                        INNER JOIN MOM_MeetingVenue V ON M.MeetingVenueID = V.MeetingVenueID
                        INNER JOIN MOM_MeetingType  T ON M.MeetingTypeID  = T.MeetingTypeID
                        INNER JOIN MOM_Department   D ON M.DepartmentID   = D.DepartmentID
                        LEFT  JOIN MOM_User         U ON M.UserID         = U.UserID
                        WHERE M.UserID = @UserID
                          AND (@Search IS NULL
                            OR M.MeetingDescription LIKE '%'+@Search+'%')
                        ORDER BY M.MeetingDate DESC";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }
                else
                {
                    sql = @"
                        SELECT M.MeetingID, M.MeetingDate, M.MeetingDescription,
                               V.MeetingVenueName, T.MeetingTypeName, D.DepartmentName,
                               M.IsCancelled, M.CancellationReason,
                               ISNULL(U.Username,'—') AS CreatedBy, M.DocumentPath
                        FROM MOM_Meetings M
                        INNER JOIN MOM_MeetingVenue V ON M.MeetingVenueID = V.MeetingVenueID
                        INNER JOIN MOM_MeetingType  T ON M.MeetingTypeID  = T.MeetingTypeID
                        INNER JOIN MOM_Department   D ON M.DepartmentID   = D.DepartmentID
                        LEFT  JOIN MOM_User         U ON M.UserID         = U.UserID
                        WHERE (@Search IS NULL
                            OR M.MeetingDescription LIKE '%'+@Search+'%'
                            OR U.Username           LIKE '%'+@Search+'%')
                        ORDER BY M.MeetingDate DESC";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }

                con.Open();
                using var dr = cmd.ExecuteReader();
                while (dr.Read())
                    list.Add(new() {
                        ["MeetingID"]          = dr["MeetingID"],
                        ["MeetingDate"]        = dr["MeetingDate"],
                        ["MeetingDescription"] = dr["MeetingDescription"],
                        ["MeetingVenueName"]   = dr["MeetingVenueName"],
                        ["MeetingTypeName"]    = dr["MeetingTypeName"],
                        ["DepartmentName"]     = dr["DepartmentName"],
                        ["IsCancelled"]        = dr["IsCancelled"],
                        ["CancellationReason"] = dr["CancellationReason"],
                        ["CreatedBy"]          = dr["CreatedBy"],
                        ["DocumentPath"]       = dr["DocumentPath"]
                    });
                cmd.Dispose();
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            ViewBag.SearchText = search;
            ViewBag.FilterUserID = userId;
            return View(list);
        }

        [AdminOnly]
        [HttpGet]
        public IActionResult AdminEditMeeting(int id, int? userId)
        {
            var model = new AdminEditMeetingModel();
            try
            {
                using SqlConnection con = new(_connectionString);
                con.Open();

                using (var cmd = new SqlCommand("PR_MOM_Meetings_SelectByPK", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@MeetingID", id);
                    using var dr = cmd.ExecuteReader();
                    if (dr.Read())
                    {
                        model.MeetingID          = id;
                        model.MeetingDate        = dr["MeetingDate"] as DateTime?;
                        model.MeetingVenueID     = Convert.ToInt32(dr["MeetingVenueID"]);
                        model.MeetingTypeID      = Convert.ToInt32(dr["MeetingTypeID"]);
                        model.DepartmentID       = Convert.ToInt32(dr["DepartmentID"]);
                        model.MeetingDescription = dr["MeetingDescription"]?.ToString();
                        model.DocumentPath       = dr["DocumentPath"]?.ToString();
                        model.IsCancelled        = Convert.ToBoolean(dr["IsCancelled"]);
                        model.CancellationReason = dr["CancellationReason"]?.ToString();
                    }
                }

                model.DepartmentList    = GetAllDropdown(con, "SELECT DepartmentID AS ID, DepartmentName AS Name FROM MOM_Department ORDER BY DepartmentName");
                model.MeetingTypeList   = GetAllDropdown(con, "SELECT MeetingTypeID AS ID, MeetingTypeName AS Name FROM MOM_MeetingType ORDER BY MeetingTypeName");
                model.MeetingVenueList  = GetAllDropdown(con, "SELECT MeetingVenueID AS ID, MeetingVenueName AS Name FROM MOM_MeetingVenue ORDER BY MeetingVenueName");
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            ViewBag.ReturnUserID = userId;
            return View(model);
        }

        [AdminOnly]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AdminEditMeeting(AdminEditMeetingModel model, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_Meetings_UpdateByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingID",          model.MeetingID);
                cmd.Parameters.AddWithValue("@MeetingDate",        model.MeetingDate!.Value);
                cmd.Parameters.AddWithValue("@MeetingVenueID",     model.MeetingVenueID);
                cmd.Parameters.AddWithValue("@MeetingTypeID",      model.MeetingTypeID);
                cmd.Parameters.AddWithValue("@DepartmentID",       model.DepartmentID);
                cmd.Parameters.AddWithValue("@MeetingDescription", model.MeetingDescription ?? "");
                cmd.Parameters.AddWithValue("@DocumentPath",       (object?)model.DocumentPath ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@IsCancelled",        model.IsCancelled);
                cmd.Parameters.AddWithValue("@CancellationDateTime", model.IsCancelled ? (object)DateTime.Now : DBNull.Value);
                cmd.Parameters.AddWithValue("@CancellationReason",  (object?)model.CancellationReason ?? DBNull.Value);
                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Meeting updated successfully.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "meetings" });
            return RedirectToAction("AllMeetings");
        }

        [AdminOnly]
        public IActionResult AdminDeleteMeeting(int id, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                con.Open();
                ExecSqlDirect(con, "DELETE FROM MOM_MeetingMember WHERE MeetingID = @ID", id);
                ExecSqlDirect(con, "DELETE FROM MOM_Meetings WHERE MeetingID = @ID", id);
                TempData["SuccessMessage"] = "Meeting deleted successfully.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = "Error: " + ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "meetings" });
            return RedirectToAction("AllMeetings");
        }

        // =============================================
        //  MEETING MEMBERS  (full CRUD)
        // =============================================

        [AdminOnly]
        public IActionResult AllMeetingMembers(int meetingId, int? userId)
        {
            var list = new List<Dictionary<string, object>>();
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_MeetingMember_SelectByMeetingID", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingID", meetingId);
                con.Open();
                using var dr = cmd.ExecuteReader();
                while (dr.Read())
                    list.Add(new() {
                        ["MeetingMemberID"] = dr["MeetingMemberID"],
                        ["MeetingID"]       = dr["MeetingID"],
                        ["StaffID"]         = dr["StaffID"],
                        ["StaffName"]       = dr["StaffName"],
                        ["DepartmentName"]  = dr["DepartmentName"],
                        ["IsPresent"]       = dr["IsPresent"],
                        ["Remarks"]         = dr["Remarks"]
                    });
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            ViewBag.MeetingID = meetingId;
            ViewBag.ReturnUserID = userId;
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand(
                    "SELECT MeetingDescription, MeetingDate FROM MOM_Meetings WHERE MeetingID=@ID", con);
                cmd.Parameters.AddWithValue("@ID", meetingId);
                con.Open();
                using var dr = cmd.ExecuteReader();
                if (dr.Read()) { ViewBag.MeetingDescription = dr["MeetingDescription"]; ViewBag.MeetingDate = dr["MeetingDate"]; }
            }
            catch { }

            return View(list);
        }

        [AdminOnly]
        [HttpGet]
        public IActionResult AdminMemberAddEdit(int meetingId, int id = 0, int? userId = null)
        {
            var model = new AdminMemberModel { MeetingID = meetingId, StaffList = GetAllStaffList() };

            if (id > 0)
            {
                try
                {
                    using SqlConnection con = new(_connectionString);
                    using var cmd = new SqlCommand("PR_MOM_MeetingMember_SelectByPK", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@MeetingMemberID", id);
                    con.Open();
                    using var dr = cmd.ExecuteReader();
                    if (dr.Read())
                    {
                        model.MeetingMemberID = id;
                        model.MeetingID       = (int)dr["MeetingID"];
                        model.StaffID         = (int)dr["StaffID"];
                        model.IsPresent       = (bool)dr["IsPresent"];
                        model.Remarks         = dr["Remarks"]?.ToString();
                    }
                }
                catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }
            }
            ViewBag.ReturnUserID = userId;
            return View(model);
        }

        [AdminOnly]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AdminMemberSave(AdminMemberModel model, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand();
                cmd.Connection  = con;
                cmd.CommandType = CommandType.StoredProcedure;

                if (model.MeetingMemberID > 0)
                {
                    cmd.CommandText = "PR_MOM_MeetingMember_UpdateByPK";
                    cmd.Parameters.AddWithValue("@MeetingMemberID", model.MeetingMemberID);
                    cmd.Parameters.AddWithValue("@IsPresent", model.IsPresent);
                    cmd.Parameters.AddWithValue("@Remarks",   (object?)model.Remarks ?? DBNull.Value);
                }
                else
                {
                    cmd.CommandText = "PR_MOM_MeetingMember_Insert";
                    cmd.Parameters.AddWithValue("@MeetingID", model.MeetingID);
                    cmd.Parameters.AddWithValue("@StaffID",   model.StaffID);
                    cmd.Parameters.AddWithValue("@IsPresent", model.IsPresent);
                    cmd.Parameters.AddWithValue("@Remarks",   (object?)model.Remarks ?? DBNull.Value);
                }

                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Meeting member saved.";
            }
            catch (SqlException ex) when (ex.Message.Contains("already added"))
            {
                TempData["ErrorMessage"] = "This staff member is already added to this meeting.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            return RedirectToAction("AllMeetingMembers", new { meetingId = model.MeetingID, userId });
        }

        [AdminOnly]
        public IActionResult AdminDeleteMember(int id, int meetingId, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_MeetingMember_DeleteByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingMemberID", id);
                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Member removed.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }
            return RedirectToAction("AllMeetingMembers", new { meetingId, userId });
        }

        // =============================================
        //  ALL STAFF  (view + edit + delete)
        // =============================================

        [AdminOnly]
        public IActionResult AllStaff(string? search, int? userId)
        {
            var list = new List<Dictionary<string, object>>();
            try
            {
                using SqlConnection con = new(_connectionString);
                string sql;
                SqlCommand cmd;

                if (userId.HasValue)
                {
                    sql = @"
                        SELECT S.StaffID, S.StaffName, S.MobileNo, S.EmailAddress,
                               D.DepartmentName, S.Remarks, ISNULL(U.Username,'—') AS CreatedBy
                        FROM MOM_Staff S
                        INNER JOIN MOM_Department D ON S.DepartmentID = D.DepartmentID
                        LEFT  JOIN MOM_User       U ON S.UserID = U.UserID
                        WHERE S.UserID = @UserID
                          AND (@Search IS NULL
                            OR S.StaffName LIKE '%'+@Search+'%'
                            OR S.EmailAddress LIKE '%'+@Search+'%')
                        ORDER BY S.StaffName";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }
                else
                {
                    sql = @"
                        SELECT S.StaffID, S.StaffName, S.MobileNo, S.EmailAddress,
                               D.DepartmentName, S.Remarks, ISNULL(U.Username,'—') AS CreatedBy
                        FROM MOM_Staff S
                        INNER JOIN MOM_Department D ON S.DepartmentID = D.DepartmentID
                        LEFT  JOIN MOM_User       U ON S.UserID = U.UserID
                        WHERE (@Search IS NULL
                            OR S.StaffName LIKE '%'+@Search+'%'
                            OR S.EmailAddress LIKE '%'+@Search+'%')
                        ORDER BY S.StaffName";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }

                con.Open();
                using var dr = cmd.ExecuteReader();
                while (dr.Read())
                    list.Add(new() {
                        ["StaffID"]        = dr["StaffID"],
                        ["StaffName"]      = dr["StaffName"],
                        ["MobileNo"]       = dr["MobileNo"],
                        ["EmailAddress"]   = dr["EmailAddress"],
                        ["DepartmentName"] = dr["DepartmentName"],
                        ["Remarks"]        = dr["Remarks"],
                        ["CreatedBy"]      = dr["CreatedBy"]
                    });
                cmd.Dispose();
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            ViewBag.SearchText = search;
            ViewBag.FilterUserID = userId;
            return View(list);
        }

        [AdminOnly]
        [HttpGet]
        public IActionResult AdminEditStaff(int id, int? userId)
        {
            var model = new AdminEditStaffModel();
            try
            {
                using SqlConnection con = new(_connectionString);
                con.Open();

                using (var cmd = new SqlCommand("PR_MOM_Staff_SelectByPK", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@StaffID", id);
                    using var dr = cmd.ExecuteReader();
                    if (dr.Read())
                    {
                        model.StaffID      = id;
                        model.DepartmentID = Convert.ToInt32(dr["DepartmentID"]);
                        model.StaffName    = dr["StaffName"].ToString()!;
                        model.MobileNo     = dr["MobileNo"].ToString()!;
                        model.EmailAddress = dr["EmailAddress"].ToString()!;
                        model.Remarks      = dr["Remarks"]?.ToString();
                    }
                }
                model.DepartmentList = GetAllDropdown(con,
                    "SELECT DepartmentID AS ID, DepartmentName AS Name FROM MOM_Department ORDER BY DepartmentName");
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }
            ViewBag.ReturnUserID = userId;
            return View(model);
        }

        [AdminOnly]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AdminEditStaff(AdminEditStaffModel model, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_Staff_UpdateByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@StaffID",      model.StaffID);
                cmd.Parameters.AddWithValue("@DepartmentID", model.DepartmentID);
                cmd.Parameters.AddWithValue("@StaffName",    model.StaffName);
                cmd.Parameters.AddWithValue("@MobileNo",     model.MobileNo);
                cmd.Parameters.AddWithValue("@EmailAddress", model.EmailAddress);
                cmd.Parameters.AddWithValue("@Remarks",      (object?)model.Remarks ?? DBNull.Value);
                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Staff updated successfully.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "staff" });
            return RedirectToAction("AllStaff");
        }

        [AdminOnly]
        public IActionResult AdminDeleteStaff(int id, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                con.Open();
                // Remove from all meeting members first
                ExecSqlDirect(con, "DELETE FROM MOM_MeetingMember WHERE StaffID = @ID", id);
                using var cmd = new SqlCommand("PR_MOM_Staff_DeleteByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@StaffID", id);
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Staff deleted.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "staff" });
            return RedirectToAction("AllStaff");
        }

        // =============================================
        //  ALL DEPARTMENTS  (view + edit + delete)
        // =============================================

        [AdminOnly]
        public IActionResult AllDepartments(string? search, int? userId)
        {
            var list = new List<Dictionary<string, object>>();
            try
            {
                using SqlConnection con = new(_connectionString);
                string sql;
                SqlCommand cmd;

                if (userId.HasValue)
                {
                    sql = @"
                        SELECT D.DepartmentID, D.DepartmentName,
                               ISNULL(U.Username,'—') AS CreatedBy,
                               (SELECT COUNT(*) FROM MOM_Staff S WHERE S.DepartmentID = D.DepartmentID) AS StaffCount
                        FROM MOM_Department D
                        LEFT JOIN MOM_User U ON D.UserID = U.UserID
                        WHERE D.UserID = @UserID
                          AND (@Search IS NULL OR D.DepartmentName LIKE '%'+@Search+'%')
                        ORDER BY D.DepartmentName";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }
                else
                {
                    sql = @"
                        SELECT D.DepartmentID, D.DepartmentName,
                               ISNULL(U.Username,'—') AS CreatedBy,
                               (SELECT COUNT(*) FROM MOM_Staff S WHERE S.DepartmentID = D.DepartmentID) AS StaffCount
                        FROM MOM_Department D
                        LEFT JOIN MOM_User U ON D.UserID = U.UserID
                        WHERE (@Search IS NULL OR D.DepartmentName LIKE '%'+@Search+'%')
                        ORDER BY D.DepartmentName";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }

                con.Open();
                using var dr = cmd.ExecuteReader();
                while (dr.Read())
                    list.Add(new() {
                        ["DepartmentID"]   = dr["DepartmentID"],
                        ["DepartmentName"] = dr["DepartmentName"],
                        ["CreatedBy"]      = dr["CreatedBy"],
                        ["StaffCount"]     = dr["StaffCount"]
                    });
                cmd.Dispose();
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            ViewBag.SearchText = search;
            ViewBag.FilterUserID = userId;
            return View(list);
        }

        [AdminOnly]
        [HttpGet]
        public IActionResult AdminEditDept(int id, int? userId)
        {
            var model = new AdminEditSimpleModel();
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_Department_SelectByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DepartmentID", id);
                con.Open();
                using var dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    model.ID   = id;
                    model.Name = dr["DepartmentName"].ToString()!;
                }
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }
            ViewBag.EntityLabel = "Department";
            ViewBag.Action      = "AdminEditDept";
            ViewBag.BackAction  = "AllDepartments";
            ViewBag.ReturnUserID = userId;
            return View("AdminEditSimple", model);
        }

        [AdminOnly]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AdminEditDept(AdminEditSimpleModel model, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_Department_UpdateByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DepartmentID",   model.ID);
                cmd.Parameters.AddWithValue("@DepartmentName", model.Name);
                cmd.Parameters.AddWithValue("@DepartmentLogo", DBNull.Value);
                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Department updated.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "departments" });
            return RedirectToAction("AllDepartments");
        }

        [AdminOnly]
        public IActionResult AdminDeleteDept(int id, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_Department_DeleteByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DepartmentID", id);
                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Department deleted.";
            }
            catch (SqlException ex) { TempData["ErrorMessage"] = ex.Message.Contains("Cannot delete") ? ex.Message : "Cannot delete: " + ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "departments" });
            return RedirectToAction("AllDepartments");
        }

        // =============================================
        //  MEETING TYPES  (view + edit + delete)
        // =============================================

        [AdminOnly]
        public IActionResult AllMeetingTypes(string? search, int? userId)
        {
            var list = new List<Dictionary<string, object>>();
            try
            {
                using SqlConnection con = new(_connectionString);
                string sql;
                SqlCommand cmd;

                if (userId.HasValue)
                {
                    sql = @"
                        SELECT MT.MeetingTypeID, MT.MeetingTypeName, MT.Remarks,
                               ISNULL(U.Username,'—') AS CreatedBy
                        FROM MOM_MeetingType MT
                        LEFT JOIN MOM_User U ON MT.UserID = U.UserID
                        WHERE MT.UserID = @UserID
                          AND (@Search IS NULL OR MT.MeetingTypeName LIKE '%'+@Search+'%')
                        ORDER BY MT.MeetingTypeName";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }
                else
                {
                    sql = @"
                        SELECT MT.MeetingTypeID, MT.MeetingTypeName, MT.Remarks,
                               ISNULL(U.Username,'—') AS CreatedBy
                        FROM MOM_MeetingType MT
                        LEFT JOIN MOM_User U ON MT.UserID = U.UserID
                        WHERE (@Search IS NULL OR MT.MeetingTypeName LIKE '%'+@Search+'%')
                        ORDER BY MT.MeetingTypeName";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }

                con.Open();
                using var dr = cmd.ExecuteReader();
                while (dr.Read())
                    list.Add(new() {
                        ["MeetingTypeID"]   = dr["MeetingTypeID"],
                        ["MeetingTypeName"] = dr["MeetingTypeName"],
                        ["Remarks"]         = dr["Remarks"],
                        ["CreatedBy"]       = dr["CreatedBy"]
                    });
                cmd.Dispose();
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            ViewBag.SearchText = search;
            ViewBag.FilterUserID = userId;
            return View(list);
        }

        [AdminOnly]
        [HttpGet]
        public IActionResult AdminEditType(int id, int? userId)
        {
            var model = new AdminEditSimpleModel();
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_MeetingType_SelectByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingTypeID", id);
                con.Open();
                using var dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    model.ID      = id;
                    model.Name    = dr["MeetingTypeName"].ToString()!;
                    model.Remarks = dr["Remarks"]?.ToString();
                }
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }
            ViewBag.EntityLabel = "Meeting Type";
            ViewBag.Action      = "AdminEditType";
            ViewBag.BackAction  = "AllMeetingTypes";
            ViewBag.ReturnUserID = userId;
            return View("AdminEditSimple", model);
        }

        [AdminOnly]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AdminEditType(AdminEditSimpleModel model, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_MeetingType_UpdateByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingTypeID",   model.ID);
                cmd.Parameters.AddWithValue("@MeetingTypeName", model.Name);
                cmd.Parameters.AddWithValue("@Remarks",         (object?)model.Remarks ?? DBNull.Value);
                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Meeting type updated.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "types" });
            return RedirectToAction("AllMeetingTypes");
        }

        [AdminOnly]
        public IActionResult AdminDeleteMeetingType(int id, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_MeetingType_DeleteByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingTypeID", id);
                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Meeting type deleted.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "types" });
            return RedirectToAction("AllMeetingTypes");
        }

        // =============================================
        //  MEETING VENUES  (view + edit + delete)
        // =============================================

        [AdminOnly]
        public IActionResult AllMeetingVenues(string? search, int? userId)
        {
            var list = new List<Dictionary<string, object>>();
            try
            {
                using SqlConnection con = new(_connectionString);
                string sql;
                SqlCommand cmd;

                if (userId.HasValue)
                {
                    sql = @"
                        SELECT MV.MeetingVenueID, MV.MeetingVenueName, MV.Created,
                               ISNULL(U.Username,'—') AS CreatedBy
                        FROM MOM_MeetingVenue MV
                        LEFT JOIN MOM_User U ON MV.UserID = U.UserID
                        WHERE MV.UserID = @UserID
                          AND (@Search IS NULL OR MV.MeetingVenueName LIKE '%'+@Search+'%')
                        ORDER BY MV.MeetingVenueName";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@UserID", userId.Value);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }
                else
                {
                    sql = @"
                        SELECT MV.MeetingVenueID, MV.MeetingVenueName, MV.Created,
                               ISNULL(U.Username,'—') AS CreatedBy
                        FROM MOM_MeetingVenue MV
                        LEFT JOIN MOM_User U ON MV.UserID = U.UserID
                        WHERE (@Search IS NULL OR MV.MeetingVenueName LIKE '%'+@Search+'%')
                        ORDER BY MV.MeetingVenueName";
                    cmd = new SqlCommand(sql, con);
                    cmd.Parameters.AddWithValue("@Search", (object?)search ?? DBNull.Value);
                }

                con.Open();
                using var dr = cmd.ExecuteReader();
                while (dr.Read())
                    list.Add(new() {
                        ["MeetingVenueID"]   = dr["MeetingVenueID"],
                        ["MeetingVenueName"] = dr["MeetingVenueName"],
                        ["Created"]          = dr["Created"],
                        ["CreatedBy"]        = dr["CreatedBy"]
                    });
                cmd.Dispose();
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            ViewBag.SearchText = search;
            ViewBag.FilterUserID = userId;
            return View(list);
        }

        [AdminOnly]
        [HttpGet]
        public IActionResult AdminEditVenue(int id, int? userId)
        {
            var model = new AdminEditSimpleModel();
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_MeetingVenue_SelectByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingVenueID", id);
                con.Open();
                using var dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    model.ID   = id;
                    model.Name = dr["MeetingVenueName"].ToString()!;
                }
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }
            ViewBag.EntityLabel = "Meeting Venue";
            ViewBag.Action      = "AdminEditVenue";
            ViewBag.BackAction  = "AllMeetingVenues";
            ViewBag.ReturnUserID = userId;
            return View("AdminEditSimple", model);
        }

        [AdminOnly]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AdminEditVenue(AdminEditSimpleModel model, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_MeetingVenue_UpdateByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingVenueID",   model.ID);
                cmd.Parameters.AddWithValue("@MeetingVenueName", model.Name);
                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Venue updated.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "venues" });
            return RedirectToAction("AllMeetingVenues");
        }

        [AdminOnly]
        public IActionResult AdminDeleteVenue(int id, int? userId)
        {
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand("PR_MOM_MeetingVenue_DeleteByPK", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MeetingVenueID", id);
                con.Open();
                cmd.ExecuteNonQuery();
                TempData["SuccessMessage"] = "Venue deleted.";
            }
            catch (Exception ex) { TempData["ErrorMessage"] = ex.Message; }

            if (userId.HasValue)
                return RedirectToAction("UserDetail", new { id = userId.Value, tab = "venues" });
            return RedirectToAction("AllMeetingVenues");
        }

        // =============================================
        //  HELPERS
        // =============================================

        private int ScalarInt(SqlConnection con, string sql)
        {
            using var cmd = new SqlCommand(sql, con);
            var r = cmd.ExecuteScalar();
            return (r == null || r == DBNull.Value) ? 0 : Convert.ToInt32(r);
        }

        // Used for CASCADE DELETE steps — same connection, different ID param name
        private void ExecSql(SqlConnection con, string sql, int id)
        {
            using var cmd = new SqlCommand(sql, con);
            cmd.Parameters.AddWithValue("@ID", id);
            cmd.ExecuteNonQuery();
        }

        // Used when the param placeholder name is @ID already (generic)
        private void ExecSqlDirect(SqlConnection con, string sql, int id)
        {
            using var cmd = new SqlCommand(sql, con);
            cmd.Parameters.AddWithValue("@ID", id);
            cmd.ExecuteNonQuery();
        }

        private List<SelectListItem> GetAllDropdown(SqlConnection con, string sql)
        {
            var list = new List<SelectListItem>();
            using var cmd = new SqlCommand(sql, con);
            using var dr  = cmd.ExecuteReader();
            while (dr.Read())
                list.Add(new SelectListItem
                {
                    Value = dr["ID"].ToString(),
                    Text  = dr["Name"].ToString()
                });
            return list;
        }

        private List<SelectListItem> GetAllStaffList()
        {
            var list = new List<SelectListItem>();
            try
            {
                using SqlConnection con = new(_connectionString);
                using var cmd = new SqlCommand(
                    "SELECT StaffID AS ID, StaffName AS Name FROM MOM_Staff ORDER BY StaffName", con);
                con.Open();
                using var dr = cmd.ExecuteReader();
                while (dr.Read())
                    list.Add(new SelectListItem
                    {
                        Value = dr["ID"].ToString(),
                        Text  = dr["Name"].ToString()
                    });
            }
            catch { }
            return list;
        }
    }
}
