using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class Media
{
    public long MediaId { get; set; }

    public long? HotelId { get; set; }

    public int? RoomTypeId { get; set; }

    public string Url { get; set; } = null!;

    public string? Caption { get; set; }

    public int SortOrder { get; set; }

    public bool IsMain { get; set; }

    public DateTimeOffset CreatedAt { get; set; }

    public virtual Hotel? Hotel { get; set; }

    public virtual RoomType? RoomType { get; set; }
}
