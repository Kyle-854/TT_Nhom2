using HotelBooking.Application.Enums;
using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<User?> GetByEmailOrPhoneNumberAsync(string emailOrPhoneNumber)
        {
            return await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Email == emailOrPhoneNumber || u.Phone == emailOrPhoneNumber);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> PhoneNumberExistsAsync(string phone)
        {
            return await _context.Users.AnyAsync(u => u.Phone == phone);
        }

        public async Task<(IEnumerable<User> Items, int TotalCount)> GetPagedUsersAsync(
            string keyword,
            string roleName,
            bool? isActive,
            UserSortField? sortBy,
            bool isDescending,
            int pageIndex,
            int pageSize)
        {
            IQueryable<User> query = _context.Users
                .Include(u => u.Role)
                .AsNoTracking();

            if (!string.IsNullOrEmpty(keyword))
            {
                string? k = keyword.Trim();
                query = query.Where(u => u.Email.Contains(k) || u.Phone.Contains(k) || u.FullName.Contains(k));
            }

            if (isActive.HasValue)
            {
                query = query.Where(u => u.IsActive == isActive.Value);
            }

            if (!string.IsNullOrEmpty(roleName))
            {
                query = query.Where(u => u.Role.RoleName == roleName);
            }

            int totalCount = await query.CountAsync();

            UserSortField sortField = sortBy ?? UserSortField.CreatedAt;

            switch (sortField)
            {
                case UserSortField.FullName:
                    query = isDescending ? query.OrderByDescending(u => u.FullName) : query.OrderBy(u => u.FullName);
                    break;

                case UserSortField.Email:
                    query = isDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email);
                    break;

                case UserSortField.Phone:
                    query = isDescending ? query.OrderByDescending(u => u.Phone) : query.OrderBy(u => u.Phone);
                    break;

                case UserSortField.Role:
                    query = isDescending ? query.OrderByDescending(u => u.Role.RoleName) : query.OrderBy(u => u.Role.RoleName);
                    break;

                case UserSortField.Id:
                    query = isDescending ? query.OrderByDescending(u => u.UserId) : query.OrderBy(u => u.UserId);
                    break;

                case UserSortField.CreatedAt:
                default:
                    query = isDescending ? query.OrderByDescending(u => u.CreatedAt) : query.OrderBy(u => u.CreatedAt);
                    break;
            }

            IEnumerable<User>? items = await query
                .Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<User?> GetUserDetailWithRelatedDataAsync(long id)
        {
            return await _context.Users
                .Include(u => u.Role)
                .Include(u => u.Bookings)
                .Include(u => u.Reviews)
                .Include(u => u.Hotels)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.UserId == id);
        }
    }
}
