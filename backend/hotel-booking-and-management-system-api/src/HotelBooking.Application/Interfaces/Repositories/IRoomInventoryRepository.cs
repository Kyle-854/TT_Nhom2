using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IRoomInventoryRepository : IGenericRepository<RoomInventory>
    {
        Task<IEnumerable<RoomInventory>> GetInventoryForDateRangeAsync(int roomTypeId, DateOnly checkIn, DateOnly checkOut);
        Task UpdateAvailabilityAsync(int roomTypeId, DateOnly date, int quantityToDecrease);
    }
}
