using HotelBooking.Application.DataTransferObjects.Auth;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HotelBooking.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

           await _authService.RegisterAsync(request);

           return Ok(new { Message = "Đăng ký thành công. Vui lòng đăng nhập." });
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(UserLoginResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] UserLoginDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            UserLoginResponseDto? response = await _authService.LoginAsync(request);

            return Ok(response);
        }

        [Authorize]
        [HttpPut("change-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ChangePassword([FromBody] UserPasswordUpdateDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!long.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out long userId))
            {
                return Unauthorized(new { Message = "Không thể xác thực người dùng." });
            }

            await _authService.UpdatePasswordAsync(userId, request);

            return Ok(new { Message = "Đổi mật khẩu thành công." });
        }

        [Authorize]
        [HttpGet("user-info")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetUserInfo()
        {
            string? email = User.FindFirst(ClaimTypes.Email)?.Value;
            string? role = User.FindFirst(ClaimTypes.Role)?.Value;
            string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            return Ok(new
            {
                UserId = userId,
                Email = email,
                Role = role,
                IsAuthenticated = User.Identity?.IsAuthenticated
            });
        }
    }
}
