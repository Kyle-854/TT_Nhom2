namespace HotelBooking.Application.DataTransferObjects.RoomType
{
    public class UpdateRoomTypeRequestDto : CreateRoomTypeRequestDto
    {
        public bool IsActive { get; set; }
    }
}
