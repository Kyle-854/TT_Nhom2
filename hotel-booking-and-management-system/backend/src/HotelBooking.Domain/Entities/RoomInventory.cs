using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class RoomInventory
{
    public long RoomInventoryId { get; set; }

    public int RoomTypeId { get; set; }

    public DateOnly Date { get; set; }

    public int AvailableRooms { get; set; }

    public decimal? PriceOverride { get; set; }

    public string? Currency { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    public virtual RoomType RoomType { get; set; } = null!;
}
