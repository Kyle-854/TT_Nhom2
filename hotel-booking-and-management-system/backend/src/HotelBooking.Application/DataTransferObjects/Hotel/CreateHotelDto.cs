using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class CreateHotelDto
    {
        [Required(ErrorMessage = "The hotel name is required.")]
        [MaxLength(300)]
        public string Name { get; set; }

        public string Description { get; set; }

        [MaxLength(500)]
        public string Address { get; set; }

        [MaxLength(150)]
        public string City { get; set; }

        [MaxLength(100)]
        public string Country { get; set; }

        [Range(0, 5, ErrorMessage = "Star ratings must be from 0 to 5.")]
        public int? StarRating { get; set; }
    }
}
