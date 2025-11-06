using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IPromotionRepository : IGenericRepository<Promotion>
    {
        Task<Promotion?> GetByCodeAsync(string code, long? hotelId);
    }
}
