using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class HotelRepository : GenericRepository<Hotel>, IHotelRepository
    {
        public HotelRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Hotel>> GetHotelsByCityAsync(string city)
        {
            return await _context.Hotels
                                 .Where(h => h.City == city)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Hotel>> GetHotelsByOwnerIdAsync(long ownerUserId)
        {
            return await _context.Hotels
                                 .Where(h => h.OwnerUserId == ownerUserId)
                                 .ToListAsync();
        }

        public async Task<Hotel?> GetHotelWithDetailsAsync(long hotelId)
        {
            return await _context.Hotels
                .Include(h => h.RoomTypes)         
                .Include(h => h.Reviews)           
                .Include(h => h.Medias)            
                .Include(h => h.HotelAmenities)    
                    .ThenInclude(ha => ha.Amenity) 
                .FirstOrDefaultAsync(h => h.HotelId == hotelId);
        }

        public async Task<Hotel?> GetActiveHotelWithDetailsAsync(long hotelId)
        {
            return await _context.Hotels
                .Where(h => h.HotelId == hotelId && h.IsActive) 
                .Include(h => h.RoomTypes.Where(rt => rt.IsActive)) 
                .Include(h => h.Reviews.Where(r => r.IsPublished)) 
                .Include(h => h.Medias)
                .Include(h => h.HotelAmenities)
                    .ThenInclude(ha => ha.Amenity)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Hotel>> GetActiveHotelsSummaryAsync()
        {
            return await _context.Hotels
                .Where(h => h.IsActive)
                .Include(h => h.RoomTypes.Where(rt => rt.IsActive)) 
                .Include(h => h.Reviews.Where(r => r.IsPublished)) 
                .Include(h => h.Medias) 
                .ToListAsync();
        }
    }
}
