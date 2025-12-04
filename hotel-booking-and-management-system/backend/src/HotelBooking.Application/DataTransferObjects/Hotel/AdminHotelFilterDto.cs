using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class AdminHotelFilterDto
    {
        public string? Keyword { get; set; }
        public bool? IsActive { get; set; }
        public string? City { get; set; }
        [Range(1, 5)]
        public int? StarRating { get; set; }
        [Range(1, int.MaxValue)]
        public int PageNumber { get; set; } = 1;
        [Range(1, 100)]
        public int PageSize { get; set; } = 20;
    }
}
