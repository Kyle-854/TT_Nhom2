using HotelBooking.Domain.Entities;
using System.Data;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task CheckRoomAvailabilityAsync(long hotelId, int roomTypeId, DateOnly checkIn, DateOnly checkOut, int quantity);
        bool ValidateBookingDates(DateOnly checkIn, DateOnly checkOut, int quantity);
        Task<Promotion?> GetValidPromotionAsync(long hotelId, string promotionCode);
        Task<bool> IsHotelActiveAsync(long hotelId);
        Task<Booking?> GetBookingByCodeAsync(string bookingCode);
        Task<IEnumerable<Booking>> GetBookingsByCustomerIdAsync(long customerId);
        Task<IEnumerable<Booking>> GetBookingsByHotelIdAsync(long hotelId, DateOnly fromDate, DateOnly toDate);
        Task<Booking?> GetBookingDetailsAsync(long bookingId, long customerUserId);
        Task<long> CreateBookingViaSPAsync(long customerUserId, long hotelId, DataTable bookingRooms, string currency, decimal commissionPct, string? note, string? promotionCode);
        Task<Booking?> GetBookingWithStatusAndPaymentsAsync(long bookingId);
    }
}
