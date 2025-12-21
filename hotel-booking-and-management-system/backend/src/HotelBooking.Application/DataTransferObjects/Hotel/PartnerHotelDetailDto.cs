using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Media;

namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class PartnerHotelDetailDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public int? StarRating { get; set; }
        public bool IsActive { get; set; }
        public List<HotelMediaDto> Images { get; set; }
        public List<AmenityDto> Amenities { get; set; }
    }
}
