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
                query = query.Where(r => r.IsPublished == true);
            }

            return await query.Include(r => r.CustomerUser)
                              .OrderByDescending(r => r.CreatedAt)
                              .ToListAsync();
        }

        public async Task<Review?> GetReviewByIdWithCustomerAsync(long reviewId)
        {
            return await _context.Reviews
                .Include(r => r.CustomerUser)
                .FirstOrDefaultAsync(r => r.ReviewId == reviewId);
        }

        public async Task<bool> CheckIfBookingHasReviewAsync(long bookingId)
        {
            return await _context.Reviews
                .AnyAsync(r => r.BookingId == bookingId);
        }
    }
}
