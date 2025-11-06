using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Booking
{
    public class CreateBookingRequestDto
    {
        [Required]
        public long HotelId { get; set; }

        [Required]
        [MinLength(1, ErrorMessage = "Must book at least one room.")]
        public List<BookingRoomRequestDto> Rooms { get; set; } = new();

        public string? Note { get; set; }
    }
}
