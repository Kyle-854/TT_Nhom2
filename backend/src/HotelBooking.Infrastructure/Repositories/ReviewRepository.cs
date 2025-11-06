using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class ReviewRepository : GenericRepository<Review>, IReviewRepository
    {
        public ReviewRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Review>> GetReviewsByHotelIdAsync(long hotelId, bool includeUnpublished = false)
        {
            IQueryable<Review>? query = _context.Reviews
                                .Where(r => r.HotelId == hotelId);

            if (!includeUnpublished)
            {
                query = query.Where(r => r.IsPublished);
            }

            return await query.Include(r => r.CustomerUser)
                              .OrderByDescending(r => r.CreatedAt)
                              .ToListAsync();
        }
    }
}
