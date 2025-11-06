using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class HotelPaymentSettlement
{
    public long SettlementId { get; set; }

    public long HotelId { get; set; }

    public DateOnly PeriodStart { get; set; }

    public DateOnly PeriodEnd { get; set; }

    public int TotalBookings { get; set; }

    public decimal GrossAmount { get; set; }

    public decimal CommissionPct { get; set; }

    public decimal CommissionAmount { get; set; }

    public decimal PayableToHotel { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public virtual Hotel Hotel { get; set; } = null!;
}
