using HotelBooking.Domain.Entities;
using System.Data;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<Booking?> GetBookingByCodeAsync(string bookingCode);
        Task<IEnumerable<Booking>> GetBookingsByCustomerIdAsync(long customerId);
        Task<IEnumerable<Booking>> GetBookingsByHotelIdAsync(long hotelId, DateOnly fromDate, DateOnly toDate);
        Task<Booking?> GetBookingDetailsAsync(long bookingId, long customerUserId);
        Task<long> CreateBookingViaSPAsync(long customerUserId, long hotelId, DataTable bookingRooms, string currency, decimal commissionPct);
    }
}
