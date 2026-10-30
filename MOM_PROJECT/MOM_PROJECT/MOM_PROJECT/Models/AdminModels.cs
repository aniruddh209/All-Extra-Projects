using System.ComponentModel.DataAnnotations;

namespace MOM_PROJECT.Models
{
    // ── User management ──────────────────────────────────────────────
    public class AdminUserModel
    {
        public int UserID { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; } = "";

        // Blank = keep existing password (edit mode)
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; } = "Member";
    }

    // ── Meeting member management ─────────────────────────────────────
    public class AdminMemberModel
    {
        public int MeetingMemberID { get; set; }

        [Required]
        public int MeetingID { get; set; }

        [Required(ErrorMessage = "Please select a staff member")]
        public int StaffID { get; set; }

        public bool IsPresent { get; set; }

        [StringLength(250)]
        public string? Remarks { get; set; }

        public List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>? StaffList { get; set; }
    }

    // ── Edit Meeting ──────────────────────────────────────────────────
    public class AdminEditMeetingModel
    {
        public int MeetingID { get; set; }

        [Required(ErrorMessage = "Meeting date is required")]
        public DateTime? MeetingDate { get; set; }

        [Required(ErrorMessage = "Please select a venue")]
        public int MeetingVenueID { get; set; }

        [Required(ErrorMessage = "Please select a type")]
        public int MeetingTypeID { get; set; }

        [Required(ErrorMessage = "Please select a department")]
        public int DepartmentID { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(250)]
        public string? MeetingDescription { get; set; }

        [StringLength(500)]
        public string? DocumentPath { get; set; }

        public bool IsCancelled { get; set; }

        [StringLength(250)]
        public string? CancellationReason { get; set; }

        public List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>? DepartmentList   { get; set; }
        public List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>? MeetingTypeList  { get; set; }
        public List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>? MeetingVenueList { get; set; }
    }

    // ── Edit Staff ───────────────────────────────────────────────────
    public class AdminEditStaffModel
    {
        public int StaffID { get; set; }

        [Required(ErrorMessage = "Please select a department")]
        public int DepartmentID { get; set; }

        [Required(ErrorMessage = "Staff name is required")]
        [StringLength(50)]
        public string StaffName { get; set; } = "";

        [Required(ErrorMessage = "Mobile number is required")]
        [StringLength(20)]
        public string MobileNo { get; set; } = "";

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress]
        [StringLength(50)]
        public string EmailAddress { get; set; } = "";

        [StringLength(250)]
        public string? Remarks { get; set; }

        public List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>? DepartmentList { get; set; }
    }

    // ── Generic simple edit (Name + optional Remarks) ─────────────────
    // Reused for Department, MeetingType, MeetingVenue
    public class AdminEditSimpleModel
    {
        public int ID { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100)]
        public string Name { get; set; } = "";

        [StringLength(250)]
        public string? Remarks { get; set; }
    }
}
