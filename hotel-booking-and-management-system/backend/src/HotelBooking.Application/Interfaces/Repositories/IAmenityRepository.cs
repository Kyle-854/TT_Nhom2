using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IAmenityRepository : IGenericRepository<Amenity>
    {
        Task<bool> IsNameExistsAsync(string name);

        Task<bool> IsNameExistsForUpdateAsync(int id, string name);
        Task<bool> IsAmenityInUseAsync(int id);
        Task<bool> AreAllAmenitiesValidAsync(List<int> amenityIds);
    }
}
