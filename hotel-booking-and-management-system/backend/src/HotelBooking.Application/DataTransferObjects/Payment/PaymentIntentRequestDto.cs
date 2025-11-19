using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Payment
{
    public class PaymentIntentRequestDto
    {
        [Required]
        public long BookingId { get; set; }

        // public string PaymentProvider { get; set; }
    }
}
