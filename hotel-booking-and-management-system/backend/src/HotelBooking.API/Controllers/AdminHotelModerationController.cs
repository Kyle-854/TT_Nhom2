using HotelBooking.Application.Common;
using HotelBooking.Application.DataTransferObjects.Hotel;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Area("admins")]
    [Route("api/[area]/hotels")]
    [Authorize(Roles = "Admin")]
    public class AdminHotelModerationController : ControllerBase
    {
        private readonly AdminHotelModerationService _moderationService;

        public AdminHotelModerationController(AdminHotelModerationService moderationService)
        {
            _moderationService = moderationService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetAllHotels([FromQuery] AdminHotelFilterDto filter)
        {
            PagedResult<AdminHotelSummaryDto>? result = await _moderationService.GetAllHotelsAsync(filter);
            return Ok(result);
        }

        [HttpPut("{id}/approval")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ApproveHotel(long id, [FromBody] AdminHotelApprovalDto request)
        {
            long adminId = GetUserIdFromClaims();

            await _moderationService.ApproveHotelAsync(id, request, adminId);
            return Ok(new { Message = "Đã duyệt khách sạn thành công." });
        }

        [HttpPut("{id}/suspension")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SuspendHotel(long id, [FromBody] AdminHotelSuspensionDto request)
        {
            long adminId = GetUserIdFromClaims();

            await _moderationService.SuspendHotelAsync(id, request, adminId);
            return Ok(new { Message = "Đã đình chỉ hoạt động khách sạn thành công." });
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
