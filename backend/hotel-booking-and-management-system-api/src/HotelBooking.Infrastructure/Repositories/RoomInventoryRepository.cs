using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace HotelBooking.Infrastructure.Repositories
{
    public class RoomInventoryRepository : GenericRepository<RoomInventory>, IRoomInventoryRepository
    {
        public RoomInventoryRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<RoomInventory>> GetInventoryForDateRangeAsync(int roomTypeId, DateOnly checkIn, DateOnly checkOut)
        {
            return await _context.RoomInventories
                .Where(ri => ri.RoomTypeId == roomTypeId &&
                             ri.Date >= checkIn &&
                             ri.Date < checkOut)
                .ToListAsync();
        }

        public async Task UpdateAvailabilityAsync(int roomTypeId, DateOnly date, int quantityToDecrease)
        {
            RoomInventory? inventory = await _context.RoomInventories
                .FirstOrDefaultAsync(ri => ri.RoomTypeId == roomTypeId && ri.Date == date);

            if (inventory != null)
            {
                inventory.AvailableRooms -= quantityToDecrease;
                inventory.UpdatedAt = DateTimeOffset.UtcNow; 

                _context.RoomInventories.Update(inventory);
            }
            else
            {

                RoomType? roomType = await _context.RoomTypes
                                             .AsNoTracking() 
                                             .FirstOrDefaultAsync(rt => rt.RoomTypeId == roomTypeId);

                if (roomType == null)
                {
                    throw new InvalidOperationException($"Không tìm thấy RoomType với ID {roomTypeId} khi đang tạo inventory.");
                }

                RoomInventory? newInventory = new RoomInventory
                {
                    RoomTypeId = roomTypeId,
                    Date = date,
                    AvailableRooms = roomType.TotalRooms - quantityToDecrease,
                    PriceOverride = null, 
                    Currency = roomType.Currency,
                    UpdatedAt = DateTimeOffset.UtcNow
                };

                await _context.RoomInventories.AddAsync(newInventory);
            }
        }
    }
}
