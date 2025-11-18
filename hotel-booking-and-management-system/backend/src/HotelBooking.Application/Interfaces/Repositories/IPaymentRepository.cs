using HotelBooking.Domain.Entities;

namespace HotelBooking.Application.Interfaces.Repositories
{
    public interface IPaymentRepository : IGenericRepository<PaymentTransaction>
    {
        Task<PaymentTransaction?> GetByProviderTxnIdAsync(string providerTxnId);
        Task<PaymentTransaction?> FindCompletedByBookingIdAsync(long bookingId);
    }
}
