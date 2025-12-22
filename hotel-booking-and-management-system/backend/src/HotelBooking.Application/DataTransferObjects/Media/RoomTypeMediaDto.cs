namespace HotelBooking.Application.DataTransferObjects.Media
{
    public class RoomTypeMediaDto
    {
        public long Id { get; set; }
        public string Url { get; set; }
        public string? Caption { get; set; }
        public bool IsMain { get; set; }
    }
}
