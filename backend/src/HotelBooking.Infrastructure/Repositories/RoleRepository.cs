using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class RoleRepository : GenericRepository<Role>, IRoleRepository
    {
        public RoleRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<Role?> GetByRoleNameAsync(string roleName)
        {
            return await _context.Roles
                                 .FirstOrDefaultAsync(r => r.RoleName == roleName);
        }
    }
}
