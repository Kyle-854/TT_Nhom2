using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Media;
using HotelBooking.Application.DataTransferObjects.RoomType;

namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class HotelDetailDto
    {
        public long HotelId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public byte? StarRating { get; set; }

        public double? AverageUserRating { get; set; }
        public int ReviewCount { get; set; }

        public IEnumerable<MediaDto> Images { get; set; } = new List<MediaDto>();
        public IEnumerable<AmenityDto> Amenities { get; set; } = new List<AmenityDto>();
        public IEnumerable<RoomTypeSummaryDto> RoomTypes { get; set; } = new List<RoomTypeSummaryDto>();
    }
}
