using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;
public partial class BookingRoom
{
    public long BookingRoomId { get; set; }

    public long BookingId { get; set; }

    public int RoomTypeId { get; set; }

    public DateOnly CheckInDate { get; set; }

    public DateOnly CheckOutDate { get; set; }

    public int Nights { get; set; }

    public int Quantity { get; set; }

    public decimal NightlyRate { get; set; }

    public decimal SubTotal { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Booking Booking { get; set; } = null!;

    public virtual RoomType RoomType { get; set; } = null!;
}
