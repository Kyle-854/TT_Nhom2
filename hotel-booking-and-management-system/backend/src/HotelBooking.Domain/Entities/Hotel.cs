using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;
public partial class Hotel
{
    public long HotelId { get; set; }

    public long OwnerUserId { get; set; }

    public string Name { get; set; } = null!;

    public string? Slug { get; set; }

    public string? Description { get; set; }

    public string? Address { get; set; }

    public string? City { get; set; }

    public string? Country { get; set; }

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public sbyte? StarRating { get; set; }

    public bool? IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<HotelAmenity> HotelAmenities { get; set; } = new List<HotelAmenity>();

    public virtual ICollection<HotelPaymentSettlement> HotelPaymentSettlements { get; set; } = new List<HotelPaymentSettlement>();

    public virtual ICollection<Media> Medias { get; set; } = new List<Media>();

    public virtual User OwnerUser { get; set; } = null!;

    public virtual ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<RoomType> RoomTypes { get; set; } = new List<RoomType>();
}
