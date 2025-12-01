using AutoMapper;
using HotelBooking.Application.Common;
using HotelBooking.Application.DataTransferObjects.User;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class AdminUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AdminUserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PagedResult<UserSummaryDto>> GetUsersAsync(UserFilterDto filter)
        {
            (IEnumerable<User> users, int totalCount) = await _unitOfWork.UserRepo.GetPagedUsersAsync(
                filter.Keyword,
                filter.RoleName,
                filter.IsActive,
                filter.SortBy,
                filter.IsDescending,
                filter.PageIndex,
                filter.PageSize
            );

            List<UserSummaryDto>? userDtos = _mapper.Map<List<UserSummaryDto>>(users);

            return new PagedResult<UserSummaryDto>
            {
                Items = userDtos,
                TotalItems = totalCount,
                PageIndex = filter.PageIndex,
                PageSize = filter.PageSize
            };
        }

        public async Task<UserDetailDto?> GetUserDetailAsync(long id)
        {
            User? user = await _unitOfWork.UserRepo.GetUserDetailWithRelatedDataAsync(id);

            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng.");
            }

            return _mapper.Map<UserDetailDto>(user);
        }

        public async Task<UserDetailDto?> CreateUserAsync(AdminUserCreateDto dto)
        {
            if (await _unitOfWork.UserRepo.EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException("Email này đã được sử dụng trong hệ thống.");
            }

            if (!string.IsNullOrEmpty(dto.Phone) && await _unitOfWork.UserRepo.PhoneNumberExistsAsync(dto.Phone))
            {
                throw new InvalidOperationException("Số điện thoại này đã được sử dụng.");
            }

            Role? role = await _unitOfWork.RoleRepo.GetByIdAsync(dto.RoleId);
            if (role == null)
            {
                throw new UnauthorizedAccessException("Role không hợp lệ.");
            }

            User? user = _mapper.Map<User>(dto);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            user.CreatedAt = DateTime.Now;
            user.UpdatedAt = null;

            await _unitOfWork.UserRepo.AddAsync(user);
            await _unitOfWork.CompleteAsync();

            return await GetUserDetailAsync(user.UserId);
        }

        public async Task<bool> UpdateUserAsync(long id, AdminUserUpdateDto dto)
        {
            User? user = await _unitOfWork.UserRepo.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng để cập nhật.");
            }

            if (!string.IsNullOrEmpty(dto.Phone) && dto.Phone != user.Phone)
            {
                if (await _unitOfWork.UserRepo.PhoneNumberExistsAsync(dto.Phone))
                {
                    throw new InvalidOperationException("Số điện thoại mới đã tồn tại trong hệ thống.");
                }
            }

            _mapper.Map(dto, user);
            user.UpdatedAt = DateTime.Now;

            _unitOfWork.UserRepo.Update(user);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> ToggleUserStatusAsync(long id, bool isActive)
        {
            User? user = await _unitOfWork.UserRepo.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng.");
            }

            if (user.IsActive == isActive) return true;

            user.IsActive = isActive;
            user.UpdatedAt = DateTime.Now;

            _unitOfWork.UserRepo.Update(user);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<bool> ChangeUserRoleAsync(long id, sbyte roleId)
        {
            User? user = await _unitOfWork.UserRepo.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException("Không tìm thấy người dùng.");
            }

            Role? role = await _unitOfWork.RoleRepo.GetByIdAsync(roleId);
            if (role == null)
            {
                throw new InvalidOperationException("Role không tồn tại.");
            }

            user.RoleId = roleId;
            user.UpdatedAt = DateTime.Now;

            _unitOfWork.UserRepo.Update(user);
            await _unitOfWork.CompleteAsync();
            return true;
        }
    }
}

