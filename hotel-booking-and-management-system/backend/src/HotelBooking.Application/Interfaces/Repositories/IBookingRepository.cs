using HotelBooking.Domain.Entities;
using System.Data;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<(RoomType? RoomInfo, List<RoomInventory> Inventories)> GetRoomAvailabilityDataAsync(int roomTypeId, DateOnly checkIn, DateOnly checkOut);
        Task<Promotion?> GetPromotionByCodeAsync(long hotelId, string promotionCode, DateTimeOffset now);
        Task<bool> IsHotelActiveAsync(long hotelId);
        Task<Booking?> GetBookingByCodeAsync(string bookingCode);
        Task<IEnumerable<Booking>> GetBookingsByCustomerIdAsync(long customerId);
        Task<IEnumerable<Booking>> GetBookingsByHotelIdAsync(long hotelId, DateOnly fromDate, DateOnly toDate);
        Task<Booking?> GetBookingDetailsAsync(long bookingId, long customerUserId);
        Task<long> CreateBookingViaSPAsync(long customerUserId, long hotelId, DataTable bookingRooms, string currency, decimal commissionPct, string? note, string? promotionCode);
        Task<Booking?> GetBookingWithStatusAndPaymentsAsync(long bookingId);
        Task<(bool Success, string Message)> CancelBookingViaSPAsync(long bookingId, long customerUserId);
    }
}
