using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IMediaRepository : IGenericRepository<Media>
    {
        Task<IEnumerable<Media>> GetByHotelIdAsync(long hotelId);
        Task<IEnumerable<Media>> GetByRoomTypeIdAsync(int roomTypeId);
    }
}
