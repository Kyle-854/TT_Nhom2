using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.RoomType
{
    public class CreateRoomTypeRequestDto
    {
        [Required(ErrorMessage = "The room type name is required.")]
        [MaxLength(200, ErrorMessage = "Names must not exceed 200 characters.")]
        public string Name { get; set; }
        [MaxLength(100)]
        public string? Code { get; set; }
        public string? Description { get; set; }
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "The room rate must be greater than or equal to 0.")]
        public decimal DefaultPrice { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "The total number of rooms must be at least 1.")]
        public int TotalRooms { get; set; } = 1;

        [Range(1, 20, ErrorMessage = "Minimum number of adults is 1. (maximum number: 10)")]
        public int MaxAdults { get; set; } = 2;

        [Range(0, 10, ErrorMessage = "MaxChildren's maximum is 10")]
        public int MaxChildren { get; set; } = 0;
        public List<int>? AmenityIds { get; set; }
    }
}
