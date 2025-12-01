using HotelBooking.Application.Enums;

namespace HotelBooking.Application.DataTransferObjects.User
{
    public class UserFilterDto
    {
        public string? Keyword { get; set; }
        public string? RoleName { get; set; }
        public bool? IsActive { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public UserSortField? SortBy { get; set; }
        public bool IsDescending { get; set; } = false;
    }
}
