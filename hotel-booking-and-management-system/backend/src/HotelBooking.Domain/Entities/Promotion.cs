using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class Promotion
{
    public long PromotionId { get; set; }

    public long? HotelId { get; set; }

    public string? Code { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public decimal? DiscountPct { get; set; }

    public decimal? DiscountFixed { get; set; }

    public DateTime? StartAt { get; set; }

    public DateTime? EndAt { get; set; }

    public bool? IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual Hotel? Hotel { get; set; }
}
