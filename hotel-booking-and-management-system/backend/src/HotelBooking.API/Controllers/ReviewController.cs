using HotelBooking.API.Middlewares;
using HotelBooking.Application.DataTransferObjects.Review;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;

        public ReviewController(ReviewService reviewService)
        {
            _reviewService = reviewService;
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

        [HttpGet("hotels/{hotelId}")]
        [ProducesResponseType(typeof(IEnumerable<ReviewDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [AllowAnonymous]
        public async Task<IActionResult> GetReviewsForHotel(long hotelId)
        {
            IEnumerable<ReviewDto>? reviews = await _reviewService.GetReviewsForHotelAsync(hotelId);
            return Ok(reviews);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ReviewDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [AllowAnonymous]
        public async Task<IActionResult> GetReviewById(long id)
        {
            ReviewDto? review = await _reviewService.GetReviewByIdAsync(id);
            return Ok(review);
        }

        [HttpPost]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status401Unauthorized)]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto createDto)
        {
            long customerId = GetUserIdFromClaims();

            ReviewDto? resultDto = await _reviewService.CreateReviewAsync(createDto, customerId);

            return CreatedAtAction(nameof(GetReviewById), new { id = resultDto.ReviewId }, resultDto);
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status401Unauthorized)]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> UpdateReview(long id, [FromBody] UpdateReviewDto updateDto)
        {
            long customerId = GetUserIdFromClaims();

            ReviewDto? resultDto = await _reviewService.UpdateReviewAsync(id, updateDto, customerId);

            return Ok(resultDto);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ErrorDetails), StatusCodes.Status401Unauthorized)]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> DeleteReview(long id)
        {
            long customerId = GetUserIdFromClaims();

            await _reviewService.DeleteReviewAsync(id, customerId);

            return NoContent();
        }
    }
}
