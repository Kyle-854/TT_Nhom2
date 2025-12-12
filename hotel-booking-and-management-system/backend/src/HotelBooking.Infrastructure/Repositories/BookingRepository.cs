using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using Newtonsoft.Json;
using System.Data;
using System.Data.Common;

namespace HotelBooking.Infrastructure.Repositories
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(HotelBookingDbContext context) : base(context)
        {
        }

        public async Task<(RoomType? RoomInfo, List<RoomInventory> Inventories)> GetRoomAvailabilityDataAsync(int roomTypeId, DateOnly checkIn, DateOnly checkOut)
        {
            RoomType? roomType = await _context.RoomTypes
                .AsNoTracking()
                .Where(rt => rt.RoomTypeId == roomTypeId)
                .Select(rt => new RoomType
                {
                    RoomTypeId = rt.RoomTypeId,
                    TotalRooms = rt.TotalRooms,
                    HotelId = rt.HotelId
                })
                .FirstOrDefaultAsync();

            List<RoomInventory>? inventories = await _context.RoomInventories
                .AsNoTracking()
                .Where(ri => ri.RoomTypeId == roomTypeId
                            && ri.Date >= checkIn
                            && ri.Date < checkOut)
                .ToListAsync();

            return (roomType, inventories);
        }

        public async Task<Promotion?> GetPromotionByCodeAsync(long hotelId, string promotionCode, DateTimeOffset now)
        {
            return await _context.Promotions
                .AsNoTracking()
                .Where(p => p.Code == promotionCode
                         && p.HotelId == hotelId
                         && p.IsActive == true
                         && now >= p.StartAt
                         && now <= p.EndAt)
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

        public async Task<(bool Success, string Message)> CancelBookingViaSPAsync(long bookingId, long customerUserId)
        {
            DbConnection? connection = _context.Database.GetDbConnection();

            if (connection.State != ConnectionState.Open)
            {
                await connection.OpenAsync();
            }

            using DbCommand? command = connection.CreateCommand();
            command.CommandText = "sp_CancelBooking";
            command.CommandType = CommandType.StoredProcedure;

            DbParameter? pBookingId = command.CreateParameter();
            pBookingId.ParameterName = "p_BookingId";
            pBookingId.Value = bookingId;
            command.Parameters.Add(pBookingId);

            var pUserId = command.CreateParameter();
            pUserId.ParameterName = "p_CustomerUserId";
            pUserId.Value = customerUserId;
            command.Parameters.Add(pUserId);

            DbParameter? pSuccess = command.CreateParameter();
            pSuccess.ParameterName = "p_IsSuccess";
            pSuccess.Direction = ParameterDirection.Output;
            pSuccess.DbType = DbType.Boolean;
            command.Parameters.Add(pSuccess);

            DbParameter? pMessage = command.CreateParameter();
            pMessage.ParameterName = "p_Message";
            pMessage.Direction = ParameterDirection.Output;
            pMessage.DbType = DbType.String;
            pMessage.Size = 255;
            command.Parameters.Add(pMessage);

            await command.ExecuteNonQueryAsync();

            bool success = false;
            if (pSuccess.Value != DBNull.Value)
            {
                success = Convert.ToBoolean(pSuccess.Value);
            }

            string message = pMessage.Value?.ToString() ?? "Không có thông báo trả về.";

            return (success, message);
        }
    }
}
