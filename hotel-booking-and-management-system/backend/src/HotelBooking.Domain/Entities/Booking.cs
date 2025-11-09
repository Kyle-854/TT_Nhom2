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

    public string Currency { get; set; } = null!;

    public decimal CommissionPct { get; set; }

    public decimal CommissionAmount { get; set; }

    public byte StatusId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }

    public string? Note { get; set; }

    public virtual ICollection<BookingRoom> BookingRooms { get; set; } = new List<BookingRoom>();

    public virtual User CustomerUser { get; set; } = null!;

    public virtual Hotel Hotel { get; set; } = null!;

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual BookingStatus Status { get; set; } = null!;
}
