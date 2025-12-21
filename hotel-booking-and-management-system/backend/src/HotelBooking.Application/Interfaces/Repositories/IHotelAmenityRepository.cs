using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IHotelAmenityRepository : IGenericRepository<HotelAmenity>
    {
        Task<IEnumerable<HotelAmenity>> GetByHotelIdAsync(long hotelId);
        void RemoveRange(IEnumerable<HotelAmenity> hotelAmenities);
    }
}
