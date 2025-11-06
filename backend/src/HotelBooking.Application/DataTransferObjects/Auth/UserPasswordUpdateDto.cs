using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Auth
{
    public class UserPasswordUpdateDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; } = string.Empty;
    }
}
