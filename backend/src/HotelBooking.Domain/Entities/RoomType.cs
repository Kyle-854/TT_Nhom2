using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class RoomType
{
    public int RoomTypeId { get; set; }

    public long HotelId { get; set; }

    public string? Code { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public byte MaxAdults { get; set; }

    public byte MaxChildren { get; set; }

    public decimal DefaultPrice { get; set; }

    public string Currency { get; set; } = null!;

    public int TotalRooms { get; set; }

    public bool IsActive { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public virtual ICollection<BookingRoom> BookingRooms { get; set; } = new List<BookingRoom>();

    public virtual Hotel Hotel { get; set; } = null!;

    public virtual ICollection<Media> Media { get; set; } = new List<Media>();

    public virtual ICollection<RoomInventory> RoomInventories { get; set; } = new List<RoomInventory>();

    public virtual ICollection<RoomTypeAmenity> RoomTypeAmenities { get; set; } = new List<RoomTypeAmenity>();
}
