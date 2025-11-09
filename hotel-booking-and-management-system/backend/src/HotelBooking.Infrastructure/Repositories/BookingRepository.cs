using HotelBooking.Application.Interfaces.Repositories;
using HotelBooking.Domain.Entities;
using HotelBooking.Infrastructure.Persistence;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace HotelBooking.Infrastructure.Repositories
{
    public class BookingRepository : GenericRepository<Booking>, IBookingRepository
    {
        public BookingRepository(HotelBookingDbContext context) : base(context)
        {
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

        public async Task<long> CreateBookingViaSPAsync(long customerUserId, long hotelId, DataTable bookingRooms, string currency, decimal commissionPct)
        {
            SqlParameter tvpParam = new SqlParameter
            {
                ParameterName = "@BookingRooms",
                SqlDbType = SqlDbType.Structured,
                Value = bookingRooms,
                TypeName = "dbo.BookingRoomType"
            };

            SqlParameter outBookingIdParam = new SqlParameter
            {
                ParameterName = "@OutBookingId",
                SqlDbType = SqlDbType.BigInt,
                Direction = ParameterDirection.Output
            };

            SqlParameter customerParam = new SqlParameter("@CustomerUserId", customerUserId);
            SqlParameter hotelParam = new SqlParameter("@HotelId", hotelId);
            SqlParameter currencyParam = new SqlParameter("@Currency", currency);
            SqlParameter commissionParam = new SqlParameter("@CommissionPct", commissionPct);

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC dbo.sp_CreateBooking @CustomerUserId, @HotelId, @BookingRooms, @Currency, @CommissionPct, @OutBookingId OUTPUT",
                customerParam,
                hotelParam,
                tvpParam,
                currencyParam,
                commissionParam,
                outBookingIdParam
            );

            return (long)outBookingIdParam.Value;
        }
    }
}
