namespace HotelBooking.Application.DataTransferObjects.User
{
    public class UserDetailDto
    {
        public long UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Phone { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public int TotalBookings { get; set; }
        public int TotalReviews { get; set; }
    }
}
