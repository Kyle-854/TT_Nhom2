using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using HotelBooking.Application.Authentication;
using HotelBooking.Application.DataTransferObjects.Auth;
using HotelBooking.Application.DataTransferObjects.User;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class AuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _memoryCache;
        private readonly JwtTokenGenerator _jwtTokenGenerator;
        private readonly EmailSender _emailService;

        private const string DEFAULT_USER_ROLE_NAME = "Customer";
        private const sbyte DEFAULT_USER_ROLE_ID = 2;

        public AuthService(IUnitOfWork unitOfWork, IMapper mapper, IMemoryCache memoryCache, JwtTokenGenerator jwtTokenGenerator, EmailSender emailService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _memoryCache = memoryCache;
            _jwtTokenGenerator = jwtTokenGenerator;
            _emailService = emailService;
        }

        public async Task RegisterAsync(UserRegisterDto request)
        {
            if (await _unitOfWork.UserRepo.EmailExistsAsync(request.Email))
            {
                throw new InvalidOperationException("Email đã được đăng kí trong hệ thống. Vui lòng sử dụng email khác.");
            }

            if (await _unitOfWork.UserRepo.PhoneNumberExistsAsync(request.Phone))
            {
                throw new InvalidOperationException ("Số điện thoại đã được đăng kí trong hệ thống. Vui lòng sử dụng số điện thoại khác.");
            }

            Role? userRole = await _unitOfWork.RoleRepo.GetByRoleNameAsync(DEFAULT_USER_ROLE_NAME);

            sbyte roleId = userRole?.RoleId ?? DEFAULT_USER_ROLE_ID;

            User? newUser = _mapper.Map<User>(request);

            newUser.UserId = 0; 
            newUser.RoleId = roleId;
            newUser.IsActive = true;
            newUser.CreatedAt = DateTime.UtcNow;

            newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            await _unitOfWork.UserRepo.AddAsync(newUser);
            await _unitOfWork.CompleteAsync();
        }

        public async Task<UserLoginResponseDto> LoginAsync(UserLoginDto request)
        {
            User? user = await _unitOfWork.UserRepo.GetByEmailOrPhoneNumberAsync(request.EmailOrPhoneNumber);

            if (user == null || user.PasswordHash == null || user.IsActive != true)
            {
                throw new UnauthorizedAccessException("Email/số điện thoại hoặc mật khẩu không chính xác.");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                throw new UnauthorizedAccessException("Email/số điện thoại hoặc mật khẩu không chính xác.");
            }

            Role? userRole = await _unitOfWork.RoleRepo.GetByIdAsync(user.RoleId);

            if (userRole == null)
            {
                throw new UnauthorizedAccessException($"Lỗi hệ thống: Không tìm thấy RoleId {user.RoleId} được gán cho người dùng.");
            }
            user.Role = userRole!;

            UserSummaryDto? userSummary = _mapper.Map<UserSummaryDto>(user);
            string token = _jwtTokenGenerator.GenerateToken(userSummary);
            int expirationMinutes = _jwtTokenGenerator.GetJwtSettings().ExpirationMinutes;

            return new UserLoginResponseDto
            {
                Token = token,
                User = userSummary,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };
        }

        public async Task ForgotPasswordAsync(string email)
        {
            User? user = await _unitOfWork.UserRepo.GetByEmailOrPhoneNumberAsync(email);

            if (user == null)
            {
                throw new KeyNotFoundException("Email không tồn tại trong hệ thống.");
            }

            string token = Guid.NewGuid().ToString();

            _memoryCache.Set(token, user.Email, TimeSpan.FromMinutes(15));

            string subject = "Yêu cầu đặt lại mật khẩu";
            string body = $@"
            <h3>Xin chào,</h3>
            <p>Đây là mã xác thực đặt lại mật khẩu:</p>
            <p><strong>{token}</strong></p>
            <p>Mã có hiệu lực trong 15 phút.</p>";

            await _emailService.SendEmailAsync(user.Email, subject, body);
        }

        public async Task ResetPasswordAsync(UserResetPasswordDto request)
        {
            if (!_memoryCache.TryGetValue(request.Token, out string? userEmail))
            {
                throw new InvalidOperationException("Mã xác thực không hợp lệ hoặc đã hết hạn.");
            }

            User? user = await _unitOfWork.UserRepo.GetByEmailOrPhoneNumberAsync(userEmail!);

            if (user == null)
            {
                throw new KeyNotFoundException("Người dùng không tồn tại.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.UserRepo.Update(user);
            await _unitOfWork.CompleteAsync();

            _memoryCache.Remove(request.Token);
        }

        public async Task<string> UpdatePasswordAsync(long userId, UserPasswordUpdateDto request)
        {
            User? user = await _unitOfWork.UserRepo.GetByIdAsync(userId);

            if (user == null || user.PasswordHash == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng.");
            }

            bool isCurrentPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash);

            if (!isCurrentPasswordValid)
            {
                throw new InvalidOperationException("Mật khẩu hiện tại không chính xác.");
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.UserRepo.Update(user);
            await _unitOfWork.CompleteAsync();

            return string.Empty;
        }
    }
}
