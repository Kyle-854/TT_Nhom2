namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class AdminHotelSummaryDto
    {
        public long HotelId { get; set; }

        public string Name { get; set; } = null!;
        public string? Slug { get; set; }
        public long OwnerUserId { get; set; }
        public string OwnerName { get; set; } = "N/A";
        public string OwnerEmail { get; set; } = "N/A";
        public string? OwnerPhone { get; set; }
        public string? City { get; set; }
        public int? StarRating { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TotalBookings { get; set; } = 0;
    }
}
