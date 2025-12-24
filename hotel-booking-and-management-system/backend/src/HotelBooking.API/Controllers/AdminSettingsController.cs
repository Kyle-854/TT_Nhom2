using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Booking;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Area("admins")]
    [Route("api/[area]/settings")]
    [Authorize(Roles = "Admin")]
    public class AdminSettingsController : ControllerBase
    {
        private readonly AmenityService _amenityService;

        public AdminSettingsController(AmenityService amenityService)
        {
            _amenityService = amenityService;
        }

        [HttpGet("amenities")]
        public async Task<IActionResult> GetAllAmenities()
        {
            IEnumerable<AmenityDto>? result = await _amenityService.GetAllAmenitiesAsync();
            return Ok(result);
        }

        [HttpPost("amenities")]
        [ProducesResponseType(typeof(AmenityDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAmenity([FromBody] CreateAmenityDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            AmenityDto? result = await _amenityService.CreateAmenityAsync(dto);
            return CreatedAtAction(nameof(GetAllAmenities), new { id = result.AmenityId }, result);
        }

        [HttpPut("amenities/{id}")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateAmenity(int id, [FromBody] UpdateAmenityDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _amenityService.UpdateAmenityAsync(id, dto);
            return Ok(new { Message = "Cập nhật tiện nghi thành công." });
        }

        [HttpDelete("amenities/{id}")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteAmenity(int id)
        {
            await _amenityService.DeleteAmenityAsync(id);
            return Ok(new { Nessage = "Đã xóa tiện nghi thành công." });
        }
    }
}
