namespace HotelBooking.Application.DataTransferObjects.Search
{
    public class HotelSearchResultDto
    {
        public long HotelId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string? Address { get; set; }
        public string? City { get; set; }
        public int StarRating { get; set; }
        public string? ThumbnailUrl { get; set; }
        public double ReviewScore { get; set; }
        public int ReviewCount { get; set; }
        public decimal OriginalTotalAmount { get; set; }
        public string? RoomTypeName { get; set; }
        public int AvailableRooms { get; set; }
        public string? PromotionTitle { get; set; }
        public decimal? DiscountPct { get; set; }
        public decimal? DiscountFixed { get; set; }
        public decimal FinalTotalAmount { get; set; }

    }
}
