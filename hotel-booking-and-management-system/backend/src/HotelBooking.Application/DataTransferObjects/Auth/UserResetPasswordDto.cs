using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Auth
{
    public class UserResetPasswordDto
    {
        [Required] public string Token { get; set; } = string.Empty;
        [Required]
        [MinLength(6)] 
        public string NewPassword { get; set; } = string.Empty;
    }
}
