using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class BookingStatus
{
    public byte BookingStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
