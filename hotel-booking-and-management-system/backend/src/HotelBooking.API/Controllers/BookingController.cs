using HotelBooking.Application.DataTransferObjects.Booking;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Area("users")]
    [Route("api/[area]/[controller]")]
    [Authorize] 
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingsController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingRequestDto request)
        {
            long customerUserId = GetUserIdFromClaims();

            BookingDetailDto bookingDetail = await _bookingService.CreateBookingAsync(request, customerUserId);

            return CreatedAtAction(nameof(GetBookingDetails),  new { id = bookingDetail.BookingId }, bookingDetail);
        }

        [HttpGet("my-bookings")]
        [ProducesResponseType(typeof(IEnumerable<BookingHistoryDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetMyBookings()
        {
            long customerUserId = GetUserIdFromClaims();

            IEnumerable<BookingHistoryDto>? bookings = await _bookingService.GetMyBookingsAsync(customerUserId);

            return Ok(bookings);
        }

        [HttpGet("{id:long}")]
        [ProducesResponseType(typeof(BookingDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetBookingDetails(long id)
        {
            long customerUserId = GetUserIdFromClaims();

            BookingDetailDto? bookingDetail = await _bookingService.GetBookingDetailsAsync(id, customerUserId);

            return Ok(bookingDetail);
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
