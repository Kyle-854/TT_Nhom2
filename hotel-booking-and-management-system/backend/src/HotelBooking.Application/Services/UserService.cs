using AutoMapper;
using HotelBooking.Application.DataTransferObjects.User;
using HotelBooking.Application.Interfaces.UnitOfWork;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Services
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public UserService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<UserSummaryDto> GetProfileAsync(long userId)
        {
            User? user = await _unitOfWork.UserRepo.GetByIdAsync(userId);

            if (user == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy người dùng với ID: {userId}");
            }

            Role? userRole = await _unitOfWork.RoleRepo.GetByIdAsync(user.RoleId);

            if (userRole == null)
            {
                throw new InvalidOperationException($"Lỗi hệ thống: Không tìm thấy RoleId {user.RoleId} được gán cho người dùng ID {userId}.");
            }
            user.Role = userRole!;

            return _mapper.Map<UserSummaryDto>(user);
        }

        public async Task UpdateProfileAsync(long userId, UserProfileUpdateDto dto)
        {
            User? user = await _unitOfWork.UserRepo.GetByIdAsync(userId);

            if (user == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy người dùng với ID {userId}");
            }

            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.UserRepo.Update(user);

            await _unitOfWork.CompleteAsync();
        }
    }
}
