using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class HotelAmenityRepository : GenericRepository<HotelAmenity>, IHotelAmenityRepository
    {
        public HotelAmenityRepository(HotelBookingDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<HotelAmenity>> GetByHotelIdAsync(long hotelId)
        {
            return await _context.HotelAmenities
                .Where(ha => ha.HotelId == hotelId)
                .ToListAsync();
        }

        public void RemoveRange(IEnumerable<HotelAmenity> hotelAmenities)
        {
            _context.HotelAmenities.RemoveRange(hotelAmenities);
        }
    }
}
