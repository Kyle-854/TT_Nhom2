using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.User
{
    public class ChangeUserRoleDto
    {
        [Required]
        public sbyte RoleId { get; set; }
    }
}
