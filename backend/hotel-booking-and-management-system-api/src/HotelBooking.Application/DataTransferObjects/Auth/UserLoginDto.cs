using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Auth
{
    public class UserLoginDto
    {
        [Required]
        public string EmailOrPhoneNumber { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
