using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class AmenityRepository : GenericRepository<Amenity>, IAmenityRepository
    {
        public AmenityRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<bool> IsNameExistsAsync(string name)
        {
            return await _context.Set<Amenity>().AnyAsync(a => a.Name == name);
        }

        public async Task<bool> IsNameExistsForUpdateAsync(int id, string name)
        {
            return await _context.Set<Amenity>().AnyAsync(a => a.Name == name && a.AmenityId != id);
        }

        public async Task<bool> IsAmenityInUseAsync(int id)
        {
            bool usedInHotel = await _context.Set<HotelAmenity>().AnyAsync(x => x.AmenityId == id);
            if (usedInHotel)
            {
                return true;
            }

            bool usedInRoomType = await _context.Set<RoomTypeAmenity>().AnyAsync(x => x.AmenityId == id);
            return usedInRoomType;
        }

        public async Task<bool> AreAllAmenitiesValidAsync(List<int> amenityIds)
        {
            if (amenityIds == null || !amenityIds.Any()) return true;

            int count = await _context.Amenities
                .CountAsync(a => amenityIds.Contains(a.AmenityId));

            return count == amenityIds.Distinct().Count();
        }
    }
}
