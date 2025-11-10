namespace HotelBooking.Application.DataTransferObjects.Review
{
    public class ReviewDto
    {
        public long ReviewId { get; set; }
        public long HotelId { get; set; }
        public int Rating { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public string CustomerFullName { get; set; }

        // public string? CustomerAvatarUrl { get; set; }
    }
}
