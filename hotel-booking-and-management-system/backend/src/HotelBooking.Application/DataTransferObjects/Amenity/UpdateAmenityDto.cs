using System.ComponentModel.DataAnnotations;

namespace HotelBooking.Application.DataTransferObjects.Amenity
{
    public class UpdateAmenityDto
    {
        [Required(ErrorMessage = "Amenity name is required.")]
        [MaxLength(200, ErrorMessage = "Name no more than 200 characters.")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100, ErrorMessage = "Category name no more than 100 characters.")]
        public string? Category { get; set; }
    }
}
