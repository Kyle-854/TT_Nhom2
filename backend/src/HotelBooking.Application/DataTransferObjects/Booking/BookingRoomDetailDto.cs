namespace HotelBooking.Application.DataTransferObjects.Booking
{
    public class BookingRoomDetailDto
    {
        public long BookingRoomId { get; set; }
        public int RoomTypeId { get; set; }
        public string RoomTypeName { get; set; } = string.Empty;
        public DateOnly CheckInDate { get; set; }
        public DateOnly CheckOutDate { get; set; }
        public int Nights { get; set; }
        public int Quantity { get; set; }
        public decimal NightlyRate { get; set; }
        public decimal SubTotal { get; set; }
    }
}
