using HotelBooking.Application.DataTransferObjects.Payment;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelBooking.API.Controllers
{
    [Area("users")]
    [Route("api/[area]/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("create-intent")]
        [Authorize(Roles = "Customer")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentRequestDto request)
        {
            long currentUserId = GetUserIdFromClaims();
            PaymentIntentResponseDto? response = await _paymentService.CreatePaymentIntentAsync(request, currentUserId);

            return Ok(response);
        }

        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> PaymentWebhook([FromBody] PaymentWebhookRequestDto webhookData)
        {
            await _paymentService.HandleWebhookAsync(webhookData);

            return Ok(new { Message = "Webhook đã được xử lý." });
        }

        [HttpGet("{bookingId}/status")]
        [Authorize]
        public async Task<IActionResult> GetBookingPaymentStatus(long bookingId)
        {
            long currentUserId = GetUserIdFromClaims();
            PaymentStatusResponseDto response = await _paymentService.GetBookingPaymentStatusAsync(bookingId, currentUserId);
            return Ok(response);
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
