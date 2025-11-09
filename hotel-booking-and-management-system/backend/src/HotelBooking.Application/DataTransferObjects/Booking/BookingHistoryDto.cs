namespace HotelBooking.Application.DataTransferObjects.Booking
{
    public class BookingHistoryDto
    {
        public long BookingId { get; set; }
        public string BookingCode { get; set; } = string.Empty;
        public long HotelId { get; set; }
        public string HotelName { get; set; } = string.Empty;
        public string? HotelMainImageUrl { get; set; }
        public DateOnly OverallCheckInDate { get; set; }
        public DateOnly OverallCheckOutDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string StatusName { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
    }
}
