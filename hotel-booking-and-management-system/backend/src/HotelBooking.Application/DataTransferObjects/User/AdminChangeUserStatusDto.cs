using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.User
{
    public class ChangeUserStatusDto
    {
        [Required]
        public bool IsActive { get; set; }
    }
}
