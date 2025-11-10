using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Review
{
    public class CreateReviewDto
    {
        [Required(ErrorMessage = "Booking ID is required")]
        public long BookingId { get; set; }

        [Required(ErrorMessage = "Rating is required")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [MaxLength(300, ErrorMessage = "Title cannot exceed 300 characters")]
        public string? Title { get; set; }

        public string? Content { get; set; }
    }
}
