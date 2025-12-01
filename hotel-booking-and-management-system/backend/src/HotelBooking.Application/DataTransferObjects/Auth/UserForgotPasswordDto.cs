using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Auth
{
    public class UserForgotPasswordDto
    {
        [Required]
        [EmailAddress] 
        public string Email { get; set; } = string.Empty;
    }
}
