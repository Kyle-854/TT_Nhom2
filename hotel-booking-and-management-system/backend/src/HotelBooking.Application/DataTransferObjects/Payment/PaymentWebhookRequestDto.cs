using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Payment
{
    public class PaymentWebhookRequestDto
    {
        [Required]
        public string ProviderTxnId { get; set; }
        public bool IsSuccess { get; set; }
        public decimal AmountPaid { get; set; }
        public string? GatewayTransactionId { get; set; }
        public DateTime? PaidAt { get; set; }
        public string? ErrorMessage { get; set; }
    }
}
