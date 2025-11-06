using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class PromotionRepository : GenericRepository<Promotion>, IPromotionRepository
    {
        public PromotionRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<Promotion?> GetByCodeAsync(string code, long? hotelId)
        {
            DateTimeOffset now = DateTimeOffset.UtcNow;

            string? upperCode = code.ToUpper();

            return await _context.Promotions
                .Where(p => p.Code == upperCode && 
                             p.IsActive == true &&  
                             (p.StartAt == null || p.StartAt <= now) &&
                             (p.EndAt == null || p.EndAt >= now) &&
                             (p.HotelId == null || (hotelId.HasValue && p.HotelId == hotelId.Value))
                )
                .FirstOrDefaultAsync();
        }
    }
}
