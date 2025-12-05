using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class AdminHotelSuspensionDto
    {
        [Required(ErrorMessage = "Please enter reason for suspension.")]
        [MaxLength(1000, ErrorMessage = "Reason must not exceed 1000 characters.")]
        public string Reason { get; set; } = null!;
    }
}
