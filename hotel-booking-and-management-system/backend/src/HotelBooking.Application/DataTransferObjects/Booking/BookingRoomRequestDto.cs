using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Booking
{
    public class BookingRoomRequestDto
    {
        [Required]
        public int RoomTypeId { get; set; }

        [Required]
        public DateOnly CheckInDate { get; set; }

        [Required]
        public DateOnly CheckOutDate { get; set; }

        [Range(1, 10, ErrorMessage = "Quantity must be between 1 and 10.")]
        public int Quantity { get; set; }
    }
}
