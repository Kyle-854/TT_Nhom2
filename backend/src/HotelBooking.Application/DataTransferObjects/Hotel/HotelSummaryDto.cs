namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class HotelSummaryDto
    {
        public long HotelId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Slug { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public byte? StarRating { get; set; }
        public string? CoverImageUrl { get; set; }
        public double? AverageUserRating { get; set; }
        public decimal? StartingPrice { get; set; } 
    }
}
