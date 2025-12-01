using HotelBooking.Application.Common;
using HotelBooking.Application.DataTransferObjects.User;
using HotelBooking.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HotelBooking.API.Controllers
{
    [ApiController]
    [Area("admins")]
    [Route("api/[area]/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUserController : ControllerBase
    {
        private readonly AdminUserService _userService;

        public AdminUserController(AdminUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] UserFilterDto filter)
        {
            PagedResult<UserSummaryDto>? result = await _userService.GetUsersAsync(filter);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            UserDetailDto? user = await _userService.GetUserDetailAsync(id);
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AdminUserCreateDto dto)
        {
            UserDetailDto? createdUser = await _userService.CreateUserAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id = createdUser.UserId }, createdUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(long id, [FromBody] AdminUserUpdateDto dto)
        {
            await _userService.UpdateUserAsync(id, dto);
            return Ok(new { message = "Cập nhật thông tin người dùng thành công." });
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> ChangeStatus(long id, [FromBody] ChangeUserStatusDto dto)
        {
            await _userService.ToggleUserStatusAsync(id, dto.IsActive);

            string? statusMsg = dto.IsActive ? "kích hoạt" : "khóa";
            return Ok(new { message = $"Đã {statusMsg} tài khoản thành công." });
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> ChangeRole(long id, [FromBody] ChangeUserRoleDto dto)
        {
            await _userService.ChangeUserRoleAsync(id, dto.RoleId);
            return Ok(new { message = "Đã thay đổi quyền hạn người dùng thành công." });
        }
    }
}
