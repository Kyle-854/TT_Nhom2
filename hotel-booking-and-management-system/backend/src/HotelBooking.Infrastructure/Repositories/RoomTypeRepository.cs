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
                                      .AnyAsync(h => h.HotelId == hotelId && h.IsActive == true);
            if (!hotelExists)
            {
                return Enumerable.Empty<RoomType>();
            }

            return await _context.RoomTypes
                .Where(rt => rt.HotelId == hotelId && rt.IsActive == true)
                .Include(rt => rt.Media)
                .Include(rt => rt.RoomTypeAmenities)
                    .ThenInclude(rta => rta.Amenity)
                .ToListAsync();
        }

        public async Task<IEnumerable<RoomType>> GetAllRoomTypesByHotelAsync(long hotelId)
        {
            bool hotelExists = await _context.Hotels.AnyAsync(h => h.HotelId == hotelId);
            if (!hotelExists)
            {
                return Enumerable.Empty<RoomType>();
            }

            return await _context.RoomTypes
                .Where(rt => rt.HotelId == hotelId)
                .Include(rt => rt.Media)
                .Include(rt => rt.RoomTypeAmenities)
                    .ThenInclude(rta => rta.Amenity)
                .OrderByDescending(rt => rt.CreatedAt)
                .ToListAsync();
        }

        public async Task<RoomType?> GetRoomTypeWithDetailsAsync(int id)
        {
            return await _context.RoomTypes
                .Include(rt => rt.Media)
                .Include(rt => rt.RoomTypeAmenities)
                    .ThenInclude(rta => rta.Amenity)
                .FirstOrDefaultAsync(rt => rt.RoomTypeId == id);
        }
    }
}
