using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IRoomTypeRepository : IGenericRepository<RoomType>
    {
        Task<IEnumerable<RoomType>> GetActiveRoomTypesByHotelAsync(long hotelId);
        Task<IEnumerable<RoomType>> GetAllRoomTypesByHotelAsync(long hotelId);
        Task<RoomType?> GetRoomTypeWithDetailsAsync(int id);
    }
}
