namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class PartnerHotelSummaryDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public int? StarRating { get; set; }
        public bool IsActive { get; set; }
        public string ThumbnailUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
