using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.User
{
    public class AdminUserUpdateDto
    {
        [Required(ErrorMessage = "Full Name is required")]
        public string FullName { get; set; } = string.Empty;

        [Phone]
        public string? Phone { get; set; }
    }
}
