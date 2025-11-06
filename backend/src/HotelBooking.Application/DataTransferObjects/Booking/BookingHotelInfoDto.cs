namespace HotelBooking.Application.DataTransferObjects.Booking
{
    public class BookingHotelInfoDto
    {
        public long HotelId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string? HotelPhoneNumber { get; set; } 
    }
}
