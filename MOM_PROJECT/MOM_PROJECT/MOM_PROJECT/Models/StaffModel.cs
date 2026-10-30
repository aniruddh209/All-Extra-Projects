using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace MOM_PROJECT.Models
{
    public class StaffModel
    {
        [Key]
        public int StaffID { get; set; }
        
        public string? DepartmentName { get; set; }
        
        [Required(ErrorMessage = "Department is required")]
        public int DepartmentID { get; set; }

        [Required(ErrorMessage = "Staff Name is required")]
        [StringLength(100)]
        public string StaffName { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{10}$")]
        public string MobileNo { get; set; }

        [Required]
        [EmailAddress]
        public string EmailAddress { get; set; }

        public string? Remarks { get; set; }
        
        public List<SelectListItem>? DepartmentList { get; set; }
    }
}