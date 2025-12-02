
using HotelBooking.Application.Enums;
using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailOrPhoneNumberAsync(string emailOrPhoneNumber);

        Task<bool> EmailExistsAsync(string email);

        Task<bool> PhoneNumberExistsAsync(string phone);

        Task<(IEnumerable<User> Items, int TotalCount)> GetPagedUsersAsync(
            string keyword,
            string roleName,
            bool? isActive,
            UserSortField? sortBy,
            bool isDescending,
            int pageIndex,
            int pageSize
        );

        Task<User?> GetUserDetailWithRelatedDataAsync(long id);
    }
}
