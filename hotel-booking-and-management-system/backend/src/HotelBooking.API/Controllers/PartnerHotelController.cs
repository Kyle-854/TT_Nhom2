using HotelBooking.Application.DataTransferObjects.Amenity;
using HotelBooking.Application.DataTransferObjects.Hotel;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelBooking.API.Controllers
{
    [Area("partners")]
    [Route("api/[area]/hotels")]
    [ApiController]
    [Authorize(Roles = "HotelOwner, HotelStaff")]
    public class PartnerHotelController : ControllerBase
    {
        private readonly PartnerHotelService _hotelService;

        public PartnerHotelController(PartnerHotelService hotelService)
        {
            _hotelService = hotelService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyHotels()
        {
            long currentUserId = GetUserIdFromClaims();
            IEnumerable<PartnerHotelSummaryDto>? result = await _hotelService.GetMyHotelsAsync(currentUserId);

            return Ok(result);
        }

        [HttpGet("amenities-lookup")]
        public async Task<IActionResult> GetAmenityLookup()
        {
            List<AmenityDto>? result = await _hotelService.GetAllAmenitiesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHotelDetail(long id)
        {
            long currentUserId = GetUserIdFromClaims();
            PartnerHotelDetailDto? result = await _hotelService.GetHotelDetailAsync(id, currentUserId);

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateHotel([FromBody] CreateHotelDto dto)
        {
            long currentUserId = GetUserIdFromClaims();
            PartnerHotelSummaryDto? result = await _hotelService.CreateHotelAsync(currentUserId, dto);

            return CreatedAtAction(nameof(GetHotelDetail), new { id = result.Id }, result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHotelInfo(long id, [FromBody] UpdateHotelInfoDto dto)
        {
            long currentUserId = GetUserIdFromClaims();
            await _hotelService.UpdateHotelInfoAsync(id, currentUserId, dto);

            return NoContent();
        }

        [HttpPut("{id}/amenities")]
        public async Task<IActionResult> UpdateHotelAmenities(long id, [FromBody] UpdateHotelAmenitiesDto dto)
        {
            long currentUserId = GetUserIdFromClaims();
            await _hotelService.UpdateHotelAmenitiesAsync(id, currentUserId, dto);

            return NoContent();
        }

        [HttpPost("{id}/images")]
        public async Task<IActionResult> UploadHotelImage(long id, IFormFile imageFile, [FromForm] string caption = "", [FromForm] bool isMain = false)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("Vui lòng chọn file hình ảnh.");
            }

            string[]? allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            string? extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest($"Ảnh không hợp lệ. Chỉ hỗ trợ các định dạng: {string.Join(", ", allowedExtensions)}");
            }

            using Stream? stream = imageFile.OpenReadStream();

            UploadHotelImageDto? dto = new UploadHotelImageDto
            {
                FileName = imageFile.FileName,
                ContentType = imageFile.ContentType,
                FileContent = stream,
                Caption = caption,
                IsMain = isMain
            };

            long currentUserId = GetUserIdFromClaims();
            string? uploadedUrl = await _hotelService.UploadHotelImageAsync(id, currentUserId, dto);

            return Ok(new { Url = uploadedUrl });
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
