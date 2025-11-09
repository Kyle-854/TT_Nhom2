using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class VwHotelMonthlyRevenue
{
    public long HotelId { get; set; }

    public string HotelName { get; set; } = null!;

    public int? Year { get; set; }

    public int? Month { get; set; }

    public decimal? TotalPaid { get; set; }

    public int? BookingCount { get; set; }
}
