using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.User
{
    public class AdminUserUpdateDto
    {
        [Required]
        public string FullName { get; set; } = string.Empty;

        public string? Phone { get; set; }

        [Required]
        public byte RoleId { get; set; }

        public bool IsActive { get; set; }
    }
}
