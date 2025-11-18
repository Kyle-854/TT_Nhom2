namespace HotelBooking.Application.DataTransferObjects.Payment
{
    public class PaymentIntentResponseDto
    {
        public long PaymentId { get; set; }
        public string ProviderTxnId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string FakePaymentUrl { get; set; }
    }
}
