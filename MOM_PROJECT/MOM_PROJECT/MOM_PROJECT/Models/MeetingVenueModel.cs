using System;
using System.ComponentModel.DataAnnotations;

namespace MOM_PROJECT.Models
{
    public class MeetingVenueModel
    {
        [Key]
        public int MeetingVenueID { get; set; }
        
        [Required(ErrorMessage = "Meeting Venue Name is required")]
        [StringLength(100, ErrorMessage = "Meeting Venue Name cannot exceed 100 characters")]
        [MinLength(3, ErrorMessage = "Meeting Venue Name must be at least 3 characters")]
        public string MeetingVenueName { get; set; }
        
        [Required]
        public DateTime Created { get; set; }

        [Required]
        public DateTime Modified { get; set; }
    }
}