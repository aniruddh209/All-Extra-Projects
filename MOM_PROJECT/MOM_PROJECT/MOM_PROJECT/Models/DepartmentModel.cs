using System.ComponentModel.DataAnnotations;

namespace MOM_PROJECT.Models;

public class DepartmentModel
{
    [Key]
    public int DepartmentID { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string DepartmentName { get; set; }

    // File path stored in DB (e.g. /uploads/abc.png)
    public string? DepartmentLogo { get; set; }

    // For receiving uploaded file from form (NOT stored in DB)
    public IFormFile? LogoFile { get; set; }

    public DateTime Created { get; set; }

    public DateTime Modified { get; set; }
}