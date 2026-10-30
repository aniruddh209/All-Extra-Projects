using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace MOM_PROJECT.Models
{
    public class MeetingMemberModel
    {
        public int MeetingMemberID { get; set; }
        public int MeetingID { get; set; }
        public int StaffID { get; set; }
        
        public string StaffName { get; set; } = "";
        public string DepartmentName { get; set; } = "";

        public bool? IsPresent { get; set; }
        public string Remarks { get; set; } = "";
        
        public List<SelectListItem>? MeetingList { get; set; }
        public List<SelectListItem>? StaffList { get; set; }
    }
}