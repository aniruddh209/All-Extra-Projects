using System.ComponentModel.DataAnnotations;

namespace MOM_PROJECT.Models;

public class MeetingTypeModel
{
    [Key]
    public int MeetingTypeID { get; set; }

    [Required(ErrorMessage = "Meeting Type Name is required")]
    public string MeetingTypeName { get; set; }

    [Required(ErrorMessage = "Remarks is required")]
    public string Remarks { get; set; }

    public DateTime Created { get; set; }
    public DateTime Modified { get; set; }
}