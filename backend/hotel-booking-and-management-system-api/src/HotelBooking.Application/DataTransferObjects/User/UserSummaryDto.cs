namespace HotelBooking.Application.DataTransferObjects.User
{
    public class UserSummaryDto
    {
        public long UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public bool IsActive { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}
