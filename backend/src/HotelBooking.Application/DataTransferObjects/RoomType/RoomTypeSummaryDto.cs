namespace HotelBooking.Application.DataTransferObjects.RoomType
{
    public class RoomTypeSummaryDto
    {
        public long RoomTypeId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public decimal PricePerNight { get; set; }
    }
}
