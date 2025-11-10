using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IReviewRepository : IGenericRepository<Review>
    {
        Task<IEnumerable<Review>> GetReviewsByHotelIdAsync(long hotelId, bool includeUnpublished = false);
        Task<Review?> GetReviewByIdWithCustomerAsync(long reviewId);
        Task<bool> CheckIfBookingHasReviewAsync(long bookingId);
    }
}
