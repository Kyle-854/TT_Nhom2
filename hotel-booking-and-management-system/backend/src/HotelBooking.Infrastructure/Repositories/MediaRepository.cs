using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class MediaRepository : GenericRepository<Media>, IMediaRepository
    {
        public MediaRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Media>> GetByHotelIdAsync(long hotelId)
        {
            return await _context.Media
                .Where(m => m.HotelId == hotelId)
                .OrderBy(m => m.SortOrder)
                .ToListAsync();
        }

        public async Task<IEnumerable<Media>> GetByRoomTypeIdAsync(int roomTypeId)
        {
            return await _context.Media
                .Where(m => m.RoomTypeId == roomTypeId)
                .ToListAsync();
        }
    }
}
