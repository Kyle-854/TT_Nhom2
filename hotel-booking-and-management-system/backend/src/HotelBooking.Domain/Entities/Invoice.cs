using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class Invoice
{
    public long InvoiceId { get; set; }

    public long BookingId { get; set; }

    public string InvoiceNumber { get; set; } = null!;

    public DateTime IssuedAt { get; set; }

    public decimal AmountBeforeTax { get; set; }

    public decimal TaxAmount { get; set; }

    public decimal TotalAmount { get; set; }

    public string Currency { get; set; } = null!;

    public virtual Booking Booking { get; set; } = null!;
}
