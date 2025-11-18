namespace HotelBooking.Application.DataTransferObjects.Payment
{
    public class PaymentStatusResponseDto
    {
        public long BookingId { get; set; }
        public string BookingStatus { get; set; }
        public string LastPaymentStatus { get; set; }
        public DateTimeOffset? LastPaymentAttemptAt { get; set; }
    }
}
