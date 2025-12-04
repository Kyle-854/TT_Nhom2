using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class AdminHotelApprovalDto
    {
        [MaxLength(500, ErrorMessage = "Notes must not exceed 500 characters.")]
        public string? Note { get; set; }
    }
}
