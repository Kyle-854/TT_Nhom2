using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.User
{
    public class AdminUserCreateDto
    {
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Full Name is required")]
        public string FullName { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Invalid phone number")]
        public string? Phone { get; set; }

        [Required]
        public sbyte RoleId { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
