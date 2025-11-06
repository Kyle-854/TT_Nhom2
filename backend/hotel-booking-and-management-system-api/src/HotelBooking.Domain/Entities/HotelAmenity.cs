using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class HotelAmenity
{
    public long HotelAmenityId { get; set; }

    public long HotelId { get; set; }

    public int AmenityId { get; set; }

    public DateTimeOffset AddedAt { get; set; }

    public virtual Amenity Amenity { get; set; } = null!;

    public virtual Hotel Hotel { get; set; } = null!;
}
