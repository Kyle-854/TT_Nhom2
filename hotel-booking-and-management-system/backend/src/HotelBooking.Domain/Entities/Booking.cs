using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class Booking
{
    public long BookingId { get; set; }

    public string BookingCode { get; set; } = null!;

    public long CustomerUserId { get; set; }

    public long HotelId { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal DiscountAmount { get; set; }

    public string Currency { get; set; } = null!;

    public decimal CommissionPct { get; set; }

    public decimal CommissionAmount { get; set; }

    public sbyte StatusId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? Note { get; set; }

    public long? PromotionId { get; set; }

    public virtual ICollection<BookingRoom> BookingRooms { get; set; } = new List<BookingRoom>();

    public virtual User CustomerUser { get; set; } = null!;

    public virtual Hotel Hotel { get; set; } = null!;

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();

    public virtual Promotion? Promotion { get; set; }

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual BookingStatus Status { get; set; } = null!;
}
