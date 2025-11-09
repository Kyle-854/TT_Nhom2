using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class RoomTypeRepository : GenericRepository<RoomType>, IRoomTypeRepository
    {
        public RoomTypeRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<RoomType>> GetActiveRoomTypesByHotelAsync(long hotelId)
        {
            bool hotelExists = await _context.Hotels
                                      .AnyAsync(h => h.HotelId == hotelId && h.IsActive);
            if (!hotelExists)
            {
                return Enumerable.Empty<RoomType>();
            }

            return await _context.RoomTypes
                .Where(rt => rt.HotelId == hotelId && rt.IsActive)
                .Include(rt => rt.Media)
                .Include(rt => rt.RoomTypeAmenities)
                    .ThenInclude(rta => rta.Amenity)
                .ToListAsync();
        }
    }
}
