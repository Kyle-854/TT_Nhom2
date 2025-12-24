using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Media;

namespace HotelBooking.Application.DataTransferObjects.RoomType
{
    public class PartnerRoomTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public decimal DefaultPrice { get; set; }
        public string Currency { get; set; } = "VND";
        public int TotalRooms { get; set; }
        public int MaxAdults { get; set; }
        public int MaxChildren { get; set; }
        public bool IsActive { get; set; }
        public List<RoomTypeMediaDto> Images { get; set; } = new List<RoomTypeMediaDto>();
        public List<AmenityDto> Amenities { get; set; } = new List<AmenityDto>();
    }
}
