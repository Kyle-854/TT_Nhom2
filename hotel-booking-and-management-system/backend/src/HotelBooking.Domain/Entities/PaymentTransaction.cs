namespace HotelBooking.Domain.Entities;

public partial class PaymentTransaction
{
    public long PaymentId { get; set; }

    public long BookingId { get; set; }

    public string? PaymentProvider { get; set; }

    public string? ProviderTxnId { get; set; }

    public decimal Amount { get; set; }

    public string Currency { get; set; } = null!;

    public sbyte StatusId { get; set; }

    public DateTime? PaidAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? Note { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual PaymentStatus Status { get; set; } = null!;
}
