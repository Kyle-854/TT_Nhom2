namespace HotelBooking.Application.DataTransferObjects.Amenity
{
    public class AmenityDto
    {
        public int AmenityId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Category { get; set; }
    }
}
