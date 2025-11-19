using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class Review
{
    public long ReviewId { get; set; }

    public long HotelId { get; set; }

    public long? BookingId { get; set; }

    public long CustomerUserId { get; set; }

    public sbyte Rating { get; set; }

    public string? Title { get; set; }

    public string? Content { get; set; }

    public bool? IsPublished { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Booking? Booking { get; set; }

    public virtual User CustomerUser { get; set; } = null!;

    public virtual Hotel Hotel { get; set; } = null!;
}
