namespace HotelBooking.Application.DataTransferObjects.Booking
{
    public class BookingDetailDto
    {
        public long BookingId { get; set; }
        public string BookingCode { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public string Currency { get; set; } = string.Empty;
        public string StatusName { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset? UpdatedAt { get; set; }
        public string? Note { get; set; }
        public BookingHotelInfoDto HotelInfo { get; set; } = null!;
        public List<BookingRoomDetailDto> BookingRooms { get; set; } = new();
        public List<BookingPaymentTransactionDto> PaymentTransactions { get; set; } = new();
    }
}
