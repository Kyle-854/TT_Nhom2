using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Media;

namespace HotelBooking.Application.DataTransferObjects.RoomType
{
    public class RoomTypeDto
    {
        public long RoomTypeId { get; set; }
        public bool? IsActive { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int Capacity { get; set; }
        public decimal PricePerNight { get; set; }
        public IEnumerable<MediaDto> Images { get; set; } = new List<MediaDto>();
        public IEnumerable<AmenityDto> Amenities { get; set; } = new List<AmenityDto>();
    }
}
