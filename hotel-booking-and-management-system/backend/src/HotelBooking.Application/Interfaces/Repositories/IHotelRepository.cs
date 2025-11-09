using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IHotelRepository : IGenericRepository<Hotel>
    {
        Task<Hotel?> GetHotelWithDetailsAsync(long hotelId);
        Task<IEnumerable<Hotel>> GetHotelsByCityAsync(string city);
        Task<IEnumerable<Hotel>> GetHotelsByOwnerIdAsync(long ownerUserId);
        Task<Hotel?> GetActiveHotelWithDetailsAsync(long hotelId);
        Task<IEnumerable<Hotel>> GetActiveHotelsSummaryAsync();
    }
}
