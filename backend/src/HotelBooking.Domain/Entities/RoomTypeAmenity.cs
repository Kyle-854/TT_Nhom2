using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class RoomTypeAmenity
{
    public long RoomTypeAmenityId { get; set; }

    public int RoomTypeId { get; set; }

    public int AmenityId { get; set; }

    public virtual Amenity Amenity { get; set; } = null!;

    public virtual RoomType RoomType { get; set; } = null!;
}
