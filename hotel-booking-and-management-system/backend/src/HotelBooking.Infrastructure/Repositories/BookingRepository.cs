using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using Newtonsoft.Json;
using System.Data;

namespace HotelBooking.Infrastructure.Repositories
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task CheckRoomAvailabilityAsync(long hotelId, int roomTypeId,DateOnly checkIn,DateOnly checkOut,int quantity)
        {
            (int RoomTypeId, int TotalRooms, long HotelId)? roomType = await _context.RoomTypes
                .AsNoTracking()
                .Where(rt => rt.RoomTypeId == roomTypeId)
                .Select(rt => new { rt.RoomTypeId, rt.TotalRooms, rt.HotelId })
                .FirstOrDefaultAsync()
                .ContinueWith(t => t.Result != null ? (t.Result.RoomTypeId, t.Result.TotalRooms, t.Result.HotelId) : ((int, int, long)?)null);

            if (roomType == null)
            {
                throw new KeyNotFoundException($"Loại phòng với ID {roomTypeId} không tồn tại.");
            }

            if (roomType.Value.HotelId != hotelId)
            {
                throw new InvalidOperationException($"Loại phòng {roomTypeId} không thuộc về khách sạn {hotelId}.");
            }

            List<RoomInventory>? inventories = await _context.RoomInventories
                .AsNoTracking()
                .Where(ri => ri.RoomTypeId == roomTypeId && ri.Date >= checkIn && ri.Date < checkOut)
                .ToListAsync();

            DateOnly currentDate = checkIn;
            while (currentDate < checkOut)
            {
                RoomInventory? inventoryRecord = inventories.FirstOrDefault(ri => ri.Date == currentDate);

                int availableRooms;

                if (inventoryRecord != null)
                {
                    availableRooms = inventoryRecord.AvailableRooms;
                }
                else
                {
                    availableRooms = roomType.Value.TotalRooms;
                }

                if (availableRooms < quantity)
                {
                    throw new InvalidOperationException($"Loại phòng {roomTypeId} không đủ số lượng vào ngày {currentDate:dd/MM/yyyy}. Còn lại: {availableRooms}, Yêu cầu: {quantity}");
                }

                currentDate = currentDate.AddDays(1);
            }
        }

        public bool ValidateBookingDates(DateOnly checkIn, DateOnly checkOut, int quantity)
        {
            if (quantity <= 0) return false;
            if (checkOut <= checkIn) return false;
            return true;
        }

        public async Task<Promotion?> GetValidPromotionAsync(long hotelId, string promotionCode)
        {
            if (string.IsNullOrWhiteSpace(promotionCode))
                return null;

            DateTimeOffset today = DateTimeOffset.Now;

            return await _context.Promotions
                .Where(p => p.Code == promotionCode
                         && p.HotelId == hotelId
                         && p.IsActive == true
                         && today >= p.StartAt
                         && today <= p.EndAt)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> IsHotelActiveAsync(long hotelId)
        {
            return await _context.Hotels.AnyAsync(h => h.HotelId == hotelId && h.IsActive == true);
        }

        public async Task<Booking?> GetBookingByCodeAsync(string bookingCode)
        {
            return await _context.Bookings
                .Include(b => b.BookingRooms)           
                    .ThenInclude(br => br.RoomType)     
                .Include(b => b.PaymentTransactions)    
                .Include(b => b.CustomerUser)           
                .FirstOrDefaultAsync(b => b.BookingCode == bookingCode);
        }

        public async Task<IEnumerable<Booking>> GetBookingsByCustomerIdAsync(long customerId)
        {
            return await _context.Bookings
                    .Where(b => b.CustomerUserId == customerId)

                    .Include(b => b.Status)
                    .Include(b => b.BookingRooms)
                    .Include(b => b.Hotel)
                        .ThenInclude(h => h.Medias.Where(m => m.IsMain).Take(1))

                    .OrderByDescending(b => b.CreatedAt)
                    .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsByHotelIdAsync(long hotelId, DateOnly fromDate, DateOnly toDate)
        {
            return await _context.Bookings
                .Where(b => b.HotelId == hotelId)
                .Where(b => b.BookingRooms.Any(r =>
                    r.CheckInDate < toDate &&   
                    r.CheckOutDate > fromDate   
                ))
                .Include(b => b.CustomerUser) 
                .Include(b => b.BookingRooms)
                .ToListAsync();
        }

        public async Task<Booking?> GetBookingDetailsAsync(long bookingId, long customerUserId)
        {
            return await _context.Bookings
                .Where(b => b.BookingId == bookingId && b.CustomerUserId == customerUserId)

                .Include(b => b.Status)
                .Include(b => b.Hotel)

                .Include(b => b.BookingRooms)
                    .ThenInclude(br => br.RoomType)

                .Include(b => b.PaymentTransactions)
                    .ThenInclude(pt => pt.Status)

                .FirstOrDefaultAsync();
        }

        public async Task<long> CreateBookingViaSPAsync(long customerUserId, long hotelId, DataTable bookingRooms, string currency, decimal commissionPct, string? note, string? promotionCode)
        {
            string bookingRoomsJson = JsonConvert.SerializeObject(bookingRooms);

            MySqlParameter customerParam = new MySqlParameter("@CustomerUserId", customerUserId);
            MySqlParameter hotelParam = new MySqlParameter("@HotelId", hotelId);
            MySqlParameter bookingRoomsParam = new MySqlParameter("@BookingRoomsJson", bookingRoomsJson);
            MySqlParameter currencyParam = new MySqlParameter("@Currency", currency);
            MySqlParameter commissionParam = new MySqlParameter("@CommissionPct", commissionPct);
            MySqlParameter noteParam = new MySqlParameter("@Note", note ?? (object)DBNull.Value);
            MySqlParameter promoParam = new MySqlParameter("@PromotionCode", promotionCode ?? (object)DBNull.Value);

            List<long> results = await _context.Database
                .SqlQuery<long>($"CALL sp_CreateBooking({customerParam}, {hotelParam}, {bookingRoomsParam}, {currencyParam}, {commissionParam}, {noteParam}, {promoParam})")
                .ToListAsync();

            return results.FirstOrDefault();
        }

        public async Task<Booking?> GetBookingWithStatusAndPaymentsAsync(long bookingId)
        {
            return await _context.Bookings
                .AsNoTracking()
                .Include(b => b.Status)
                .Include(b => b.PaymentTransactions)
                    .ThenInclude(p => p.Status)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);
        }
    }
}
