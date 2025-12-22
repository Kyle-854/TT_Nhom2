using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Media;
using HotelBooking.Application.DataTransferObjects.RoomType;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Area("partners")]
    [Route("api/[area]")]
    [Authorize(Roles = "HotelOwner")]
    public class PartnerRoomTypeController : ControllerBase
    {
        private readonly PartnerRoomTypeService _roomTyppeService;

        public PartnerRoomTypeController(PartnerRoomTypeService roomService)
        {
            _roomTyppeService = roomService;
        }

        [HttpGet("hotels/{hotelId}/room-types")]
        public async Task<IActionResult> GetRoomTypes(long hotelId)
        {
            List<RoomTypeDto>? result = await _roomTyppeService.GetRoomTypesAsync(hotelId);
            return Ok(result);
        }

        [HttpGet("room-types/{id}")]
        public async Task<IActionResult> GetRoomTypeById(int id)
        {
            RoomTypeDto? result = await _roomTyppeService.GetRoomTypeByIdAsync(id);

            return Ok(result);
        }

        [HttpGet("room-types/amenities-lookup")]
        public async Task<IActionResult> GetAmenityLookup()
        {
            List<AmenityDto>? result = await _roomTyppeService.GetAllAmenitiesAsync();
            return Ok(result);
        }

        [HttpPost("hotels/{hotelId}/room-types")]
        public async Task<IActionResult> CreateRoomType(long hotelId, [FromBody] CreateRoomTypeRequestDto request)
        {
            long currentUserId = GetUserIdFromClaims();
            RoomTypeDto? result = await _roomTyppeService.CreateRoomTypeAsync(hotelId, currentUserId, request);

            return CreatedAtAction(nameof(GetRoomTypeById), new { id = result.RoomTypeId }, result);
        }

        [HttpPut("room-types/{id}")]
        public async Task<IActionResult> UpdateRoomType(int id, [FromBody] UpdateRoomTypeRequestDto request)
        {
            long currentUserId = GetUserIdFromClaims();
            RoomTypeDto? result = await _roomTyppeService.UpdateRoomTypeAsync(id, currentUserId, request);
            return Ok(result);
        }

        [HttpDelete("room-types/{id}")]
        public async Task<IActionResult> DeleteRoomType(int id)
        {
            long currentUserId = GetUserIdFromClaims();
            await _roomTyppeService.DeleteRoomTypeAsync(id, currentUserId);
            return NoContent();
        }

        [HttpPost("room-types/{id}/images")]
        public async Task<IActionResult> UploadRoomImage(int id, IFormFile imageFile, [FromForm] string caption = "", [FromForm] bool isMain = false)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("Vui lòng chọn file hình ảnh.");
            }

            string[] allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            string extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest($"Ảnh không hợp lệ. Chỉ hỗ trợ các định dạng: {string.Join(", ", allowedExtensions)}");
            }

            using Stream stream = imageFile.OpenReadStream();

            RoomImageUploadDto? dto = new RoomImageUploadDto
            {
                FileName = imageFile.FileName,
                ContentType = imageFile.ContentType,
                FileContent = stream,
                Caption = caption,
                IsMain = isMain
            };

            long currentUserId = GetUserIdFromClaims();

            RoomTypeMediaDto? result = await _roomTyppeService.UploadRoomImageAsync(id, currentUserId, dto);

            return Ok(result);
        }

        private long GetUserIdFromClaims()
        {
            Claim? userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdClaim?.Value, out long userId))
            {
                throw new UnauthorizedAccessException("Token không hợp lệ hoặc không chứa UserID.");
            }

            return userId;
        }
    }
}
