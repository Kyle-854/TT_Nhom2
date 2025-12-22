using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Hotel
{
    public class UpdateHotelInfoDto
    {
        [Required]
        [MaxLength(300)]
        public string Name { get; set; }

        public string Description { get; set; }

        [MaxLength(500)]
        public string Address { get; set; }

        [MaxLength(150)]
        public string City { get; set; }

        [MaxLength(100)]
        public string Country { get; set; }

        [Range(-90, 90)]
        public double? Latitude { get; set; }

        [Range(-180, 180)]
        public double? Longitude { get; set; }

        [Range(0, 5)]
        public int? StarRating { get; set; }

        public bool? IsActive { get; set; }
    }
}
