using HotelBooking.Application.DataTransferObjects.User;

namespace HotelBooking.Application.DataTransferObjects.Auth
{
    public class UserLoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public UserSummaryDto User { get; set; } = null!; // Gửi kèm thông tin tóm tắt
        public DateTime ExpiresAt { get; set; }
    }
}
